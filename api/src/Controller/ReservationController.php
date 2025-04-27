<?php

namespace App\Controller;

use App\Entity\DetailReservation;
use App\Entity\Reservation;
use App\Repository\ProduitRepository;
use App\Repository\ReservationRepository;
use App\Repository\StatusReservationRepository;
use App\Repository\UtilisateurRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;

final class ReservationController extends AbstractController
{
    /**
     * Permet de récupérer l'ensemble des réservations
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/reservations', name: 'getReservations', methods:['GET'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour voir toute les reservations")]
    public function getReservations(ReservationRepository $reservationRepository, SerializerInterface $serializer): JsonResponse 
    {
        $reservationList = $reservationRepository->findAll();
        $JsonReservationList = $serializer->serialize($reservationList, 'json', ['groups' => 'getReservation']);
        return new JsonResponse($JsonReservationList, Response::HTTP_OK, [], true);
    }

    /**
     * Permet de récupérer une réservation grace à son identifiant
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/reservations/{id}', name:'getOneReservation', methods:['GET'])]
    #[IsGranted("ROLE_USER", "ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour voir cette reservation")]
    public function getOneReservation(SerializerInterface $serializer, Reservation $reservation): JsonResponse
    {
        $jsonReservation = $serializer->serialize($reservation, 'json', ['groups' => 'getReservation']);
        return new JsonResponse($jsonReservation, Response::HTTP_OK, [], true);
    }

    /**
     * Permet de créer une réservation
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/reservations', name: 'createReservation', methods: ['POST'])]
    #[IsGranted("ROLE_USER", message: "Vous n'avez pas les droits suffisant pour faire une reservation")]
    public function createReservation(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        UrlGeneratorInterface $urlGenerator,
        StatusReservationRepository $statusReservationRepository,
        ProduitRepository $produitRepository,
        UtilisateurRepository $utilisateurRepository
    ): JsonResponse {
        $content = $request->toArray();

        $reservation = new Reservation();

        // Gestion des dates
        try {
            $reservation->setDateReservation(new \DateTime);
            $reservation->setDerniersModifStatus(new \DateTime);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Gestion de l'utilisateur
        $utilisateur = $utilisateurRepository->find($content['idUtilisateur']);
        if (!$utilisateur) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_BAD_REQUEST);
        }
        $reservation->setIdUtilisateur($utilisateur);

        // Gestion du statut de réservation
        $idStatus = 1; 
        $status = $statusReservationRepository->find($idStatus);
        if (!$status) {
            return new JsonResponse(['error' => 'StatusReservation ID '.$idStatus.' non trouvé'], Response::HTTP_BAD_REQUEST);
        }
        $reservation->setStatusReservation($status);

        $em->persist($reservation);

        // Gestion des détails de réservation
        if (!isset($content['detailReservations']) || !is_array($content['detailReservations']) || empty($content['detailReservations'])) {
            return new JsonResponse(['error' => 'Aucun détail de réservation fourni'], Response::HTTP_BAD_REQUEST);
        }

        foreach ($content['detailReservations'] as $detail) {
            $produit = $produitRepository->find($detail['idProduit'] ?? null);
            if (!$produit) {
                return new JsonResponse(['error' => 'Produit ID '.$detail['idProduit'].' non trouvé'], Response::HTTP_BAD_REQUEST);
            }

            $quantiteDemandee = $detail['quantite'] ?? 0;

            if ($quantiteDemandee <= 0) {
                return new JsonResponse(['error' => 'La quantité doit être supérieure à zéro pour le produit ID '.$produit->getId()], Response::HTTP_BAD_REQUEST);
            }

            if ($quantiteDemandee > $produit->getStock()) {
                return new JsonResponse([
                    'error' => 'Stock insuffisant pour le produit ID '.$produit->getId(),
                    'stock_disponible' => $produit->getStock()
                ], Response::HTTP_BAD_REQUEST);
            }

            $detailReservation = new DetailReservation();
            $detailReservation->setIdProduit($produit);
            $detailReservation->setQuantite($quantiteDemandee);
            $detailReservation->setIdReservation($reservation);

            $em->persist($detailReservation);
            $reservation->addDetailReservation($detailReservation);

            $produit->setStock($produit->getStock() - $quantiteDemandee);
        }

        $em->flush();

        $location = $urlGenerator->generate('getOneReservation', ['id' => $reservation->getId()], UrlGeneratorInterface::ABSOLUTE_URL);
        $jsonReservation = $serializer->serialize($reservation, 'json', ['groups' => 'getReservation']);

        return new JsonResponse($jsonReservation, Response::HTTP_CREATED, ['Location' => $location], true);
    }

    /**
     * Permet la mise à jour d'une réservation grace a son identifiant
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/reservations/{id}', name: 'updateReservation', methods: ['PUT'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour modifier cette reservation")]
    public function updateReservation(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        ProduitRepository $produitRepository,
        ReservationRepository $reservationRepository,
        StatusReservationRepository $statusReservationRepository
    ): JsonResponse
    {
        $content = $request->toArray();
    
        // Vérifier que la réservation existe avec l'ID de l'URL
        $reservation = $reservationRepository->find($id);
        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation non trouvée'], Response::HTTP_NOT_FOUND);
        }
    
        // Vérifier si un nouveau statusReservation est fourni
        if (!empty($content['statusReservation'])) {
            $statusReservation = $statusReservationRepository->find($content['statusReservation']);
            if (!$statusReservation) {
                return new JsonResponse(['error' => 'StatusReservation non trouvé'], Response::HTTP_BAD_REQUEST);
            }
    
            $reservation->setStatusReservation($statusReservation);
            $reservation->setDerniersModifStatus(new \DateTime());
        }
    
        // On rétablit le stock initial pour tous les anciens détails
        foreach ($reservation->getDetailReservations() as $existingDetail) {
            $produit = $existingDetail->getIdProduit();
            $produit->setStock($produit->getStock() + $existingDetail->getQuantite());
            $em->persist($produit);
    
            $em->remove($existingDetail);
        }
    
        // Vérifier et ajouter les nouveaux détails de réservation
        if (!empty($content['detailReservations'])) {
            foreach ($content['detailReservations'] as $detail) {
                $produit = $produitRepository->find($detail['idProduit']);
                if (!$produit) {
                    return new JsonResponse(['error' => 'Produit ID ' . $detail['idProduit'] . ' non trouvé'], Response::HTTP_BAD_REQUEST);
                }
    
                $quantiteDemandee = $detail['quantite'];
    
                if ($quantiteDemandee <= 0) {
                    return new JsonResponse(['error' => 'La quantité doit être supérieure à zéro pour le produit ID ' . $produit->getId()], Response::HTTP_BAD_REQUEST);
                }
    
                if ($quantiteDemandee > $produit->getStock()) {
                    return new JsonResponse([
                        'error' => 'Stock insuffisant pour le produit ID ' . $produit->getId(),
                        'stock_disponible' => $produit->getStock()
                    ], Response::HTTP_BAD_REQUEST);
                }
    
                $detailReservation = new DetailReservation();
                $detailReservation->setIdProduit($produit);
                $detailReservation->setQuantite($quantiteDemandee);
                $detailReservation->setIdReservation($reservation);
    
                $em->persist($detailReservation);
                $reservation->addDetailReservation($detailReservation);
    
                $produit->setStock($produit->getStock() - $quantiteDemandee);
                $em->persist($produit);
            }
        }
    
        $em->persist($reservation);
        $em->flush();
    
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
    

    /**
     * Permet de supprimer une réservation grace à son identifiant
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/reservations/{id}', name: 'deleteReservation', methods:['DELETE'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour supprimer cette reservation")]
    public function deleteReservation(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        foreach ($reservation->getDetailReservations() as $detailReservation) {
            $produit = $detailReservation->getIdProduit();
            $produit->setStock($produit->getStock() + $detailReservation->getQuantite());
            $em->persist($produit);

            $em->remove($detailReservation);
        }

        $em->remove($reservation);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }


}
