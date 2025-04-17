<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

final class ProduitController extends AbstractController
{

    // Getteur sur tout les produits
    #[Route('/api/produits', name: 'produits', methods: ['GET'])]
    public function getAllProduits(ProduitRepository $produitRepository, SerializerInterface $serializer): JsonResponse
    {
        $produitsList = $produitRepository->findAll();
        $jsProduitsList = $serializer->serialize($produitsList, 'json', ['groups' => 'getProduits']);
        return new JsonResponse($jsProduitsList, Response::HTTP_OK, [], true);
    }

    // Getteur sur un produit unique
    #[Route('/api/produits/{id}', name: 'detailProduit', methods: ['GET'])]
    public function getProduit(Produit $produit, SerializerInterface $serializer): JsonResponse
    {
        $jsonProduit = $serializer->serialize($produit, 'json', ['groups' => 'getProduits']);
        return new JsonResponse($jsonProduit, Response::HTTP_OK, [], true);
    }

    // Create un produit
    #[Route('/api/produits', name: 'createProduit', methods: ['POST'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour créer un produit")]
    public function createProduit(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator): JsonResponse
    {
        $produit = $serializer->deserialize($request->getContent(), Produit::class, 'json');
        $em->persist($produit);
        $em->flush();

        $location = $urlGenerator->generate('detailProduit', ['id' => $produit->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        $jsonProduit = $serializer->serialize($produit, 'json', ['groups' => 'getProduits']);
        
        return new JsonResponse($jsonProduit, Response::HTTP_CREATED, ['Location'=>$location], true);
    }

    // Supprimer un produit
    #[Route('/api/produits/{id}', name: 'deleteProduit', methods: ['DELETE'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour supprimer un produit")]
    public function deleteProduit(Produit $produit, EntityManagerInterface $em): JsonResponse {
        $em->remove($produit);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    // Modifier un produit
    #[Route('/api/produits/{id}', name: 'updateProduit', methods: ['PUT'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour modifier un produit")]
    public function updateProduit(Produit $curentProduit, Request $request, SerializerInterface $serializer, EntityManagerInterface $em): JsonResponse 
    {
        $updateProduit = $serializer->deserialize($request->getContent(), Produit::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $curentProduit]);
        
        $em->persist($updateProduit);
        $em->flush();
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('/api/produits/{id}/image', name: 'getProduitImageURL', methods: ['GET'])]
    public function getProduitImageURL(Produit $produit, SerializerInterface $serializer): JsonResponse
    {
        $jsonProduit = $serializer->serialize($produit, 'json', ['groups' => 'getImageURL']);
        return new JsonResponse($jsonProduit, Response::HTTP_OK, [], true);
    }
}
