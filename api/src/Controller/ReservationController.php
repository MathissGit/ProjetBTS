<?php

namespace App\Controller;

use App\Entity\DetailReservation;
use App\Entity\Reservation;
use App\Entity\StatusReservation;
use App\Repository\ProduitRepository;
use App\Repository\ReservationRepository;
use App\Repository\StatusReservationRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

final class ReservationController extends AbstractController
{
    // getteur sur toute les reservations
    #[Route('/api/reservations', name: 'getReservations', methods:['GET'])]
    public function getReservations(ReservationRepository $reservationRepository, SerializerInterface $serializer): JsonResponse 
    {
        $reservationList = $reservationRepository->findAll();
        $JsonReservationList = $serializer->serialize($reservationList, 'json', ['groups' => 'getReservation']);
        return new JsonResponse($JsonReservationList, Response::HTTP_OK, [], true);
    }

    // Getteur sur une seule reservation
    #[Route('/api/reservations/{id}', name:'getOneReservation', methods:['GET'])]
    public function getOneReservation(SerializerInterface $serializer, Reservation $reservation): JsonResponse
    {
        $jsonReservation = $serializer->serialize($reservation, 'json', ['groups' => 'getReservation']);
        return new JsonResponse($jsonReservation, Response::HTTP_OK, [], true);
    }

    // creation d'une reservation
    #[Route('/api/reservations', name:'createReservation', methods:['POST'])]
    public function createReservation(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        UrlGeneratorInterface $urlGenerator,
        StatusReservationRepository $statusReservationRepository,
        ProduitRepository $produitRepository,
        UtilisateurRepository $utilisateurRepository
    ): JsonResponse
    {
        $content = $request->toArray();

        $reservation = new Reservation();
        $reservation->setDateReservation(new \DateTime($content['date_reservation']));

        $utilisateur = $utilisateurRepository->find($content['idUtilisateur']);
        if (!$utilisateur) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], Response::HTTP_BAD_REQUEST);
        }
        $reservation->setIdUtilisateur($utilisateur);

        $id_status = $content['idStatus'] ?? 1;
        $reservation->setStatusReservation($statusReservationRepository->find($id_status));

        $em->persist($reservation);

        // Creation des details de reservation
        foreach ($content['detailReservations'] as $detail) {
            $produit = $produitRepository->find($detail['idProduit']);
            if (!$produit) {
                return new JsonResponse(['error' => 'Produit ID '.$detail['idProduit'].' non trouvé'], Response::HTTP_BAD_REQUEST);
            }

            $quantiteDemandee = $detail['quantite'];

            // Validation quantité positive
            if ($quantiteDemandee <= 0) {
                return new JsonResponse(['error' => 'La quantité doit être supérieure à zéro pour le produit ID '.$produit->getId()], Response::HTTP_BAD_REQUEST);
            }

            // Validation stock suffisant
            if ($quantiteDemandee > $produit->getStock()) {
                return new JsonResponse([
                    'error' => 'Stock insuffisant pour le produit ID '.$produit->getId(),
                    'stock_disponible' => $produit->getStock()
                ], Response::HTTP_BAD_REQUEST);
            }

            // Crée le détail de réservation
            $detailReservation = new DetailReservation();
            $detailReservation->setIdProduit($produit);
            $detailReservation->setQuantite($quantiteDemandee);
            $detailReservation->setIdReservation($reservation);

            $em->persist($detailReservation);
            $reservation->addDetailReservation($detailReservation);

            // (Optionnel) Décrémenter le stock du produit
            $produit->setStock($produit->getStock() - $quantiteDemandee);
        }

        // Flush toutes les entités persistées
        $em->flush();

        // Générer l'URL de la nouvelle réservation
        $location = $urlGenerator->generate('getOneReservation', ['id' => $reservation->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        $jsonReservation = $serializer->serialize($reservation, 'json', ['groups' => 'getReservation']);
        return new JsonResponse($jsonReservation, Response::HTTP_CREATED, ['Location' => $location], true);
    }

    #[Route('/api/reservations/{id}', name:'updateReservation', methods:['PUT'])]
    public function updateReservation(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        ProduitRepository $produitRepository,
        ReservationRepository $reservationRepository
    ): JsonResponse
    {
        $content = $request->toArray();

        // Vérifier que la réservation existe avec l'ID de l'URL
        $reservation = $reservationRepository->find($id);
        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation non trouvée'], Response::HTTP_NOT_FOUND);
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

    // Supprimer une reservation
    #[Route('/api/reservations/{id}', name: 'deleteReservation', methods:['DELETE'])]
    public function deleteReservation(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        // Avant de supprimer la réservation, on rétablit le stock des produits
        foreach ($reservation->getDetailReservations() as $detailReservation) {
            $produit = $detailReservation->getIdProduit();
            $produit->setStock($produit->getStock() + $detailReservation->getQuantite());
            $em->persist($produit);

            // Supprimer les détails de réservation
            $em->remove($detailReservation);
        }

        // Supprimer la réservation
        $em->remove($reservation);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }


}
