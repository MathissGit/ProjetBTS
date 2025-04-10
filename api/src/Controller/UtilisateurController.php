<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\RoleRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

final class UtilisateurController extends AbstractController
{

    // Getteur sur tout les utilisateur
    #[Route('/api/utilisateurs', name: 'utilisateurs', methods:['GET'])]
    public function getAllUtilisateurs(UtilisateurRepository $utilisateurRepository, SerializerInterface $serializer): JsonResponse
    {
        $utilisateursList = $utilisateurRepository->findAll();
        $jsutilisateursList = $serializer->serialize($utilisateursList, 'json', ["groups" => "getUtilisateurs"]);
        return new JsonResponse($jsutilisateursList, Response::HTTP_OK, [], true); 
    }

    // Getteur sur un utilisateur unique
    #[Route('/api/utilisateurs/{id}', name: 'detailUtilisateur', methods:['GET'])]
    public function getUtilisateur(Utilisateur $utilisateur, SerializerInterface $serializer, ) : JsonResponse
    {
        $jsonutilisateur = $serializer->serialize($utilisateur, 'json', ["groups" => "getUtilisateurs"]);
        return new JsonResponse($jsonutilisateur, Response::HTTP_OK, [], true);
    }

    // Create un utilisateur
    #[Route('/api/utilisateurs', name: 'createUtilisateur', methods:['POST'])]
    public function createUtilisateur(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator, RoleRepository $roleRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $utilisateur = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json');

        $content = $request->toArray();

        $id_role = $content['idRole'] ?? 1;

        $utilisateur->setIdRole($roleRepository->find($id_role));

        $plaintextPassword = $utilisateur->getMdp();
        $hashedPassword = $passwordHasher->hashPassword($utilisateur, $plaintextPassword);
        $utilisateur->setMdp($hashedPassword);

        $em->persist($utilisateur);
        $em->flush();

        $location = $urlGenerator->generate('detailUtilisateur', ['id' => $utilisateur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        $jsonutilisateur = $serializer->serialize($utilisateur, 'json', ['groups' => 'getUtilisateurs']);
        
        return new JsonResponse($jsonutilisateur, Response::HTTP_CREATED, ['Location'=>$location], true);
    }

    // Supprimer un utilisateur
    #[Route('/api/utilisateurs/{id}', name: 'deleteUtilisateur', methods:['DELETE'])]
    public function deleteUtilisateur(Utilisateur $utilisateur, EntityManagerInterface $em): JsonResponse {
        $em->remove($utilisateur);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    // Modifier un utilisateur 
    #[Route('/api/utilisateurs/{id}', name:"updateUtilisateurs", methods:['PUT'])]
    public function updateUtilisateur(Request $request, SerializerInterface $serializer, Utilisateur $currentUtilisateur, EntityManagerInterface $em): JsonResponse 
    {
        $updateUtilisateur = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentUtilisateur]);
        
        $em->persist($updateUtilisateur);
        $em->flush();
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
   }
   
   // modifier un mot de passe 
   #[Route('/api/utilisateurs/{id}/password', name:"updateUtilisateursPassword", methods:['PUT'])]
   public function updateUtilisateurPassword(Request $request, SerializerInterface $serializer, Utilisateur $currentUtilisateur, EntityManagerInterface $em): JsonResponse 
   {
    $updateUtilisateurPassword = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentUtilisateur], ['groups' => 'setUtilisateurPassword']);

    // TODO: Hashage de mot de passe et verification du mot de passe avant l'update 

    $em->persist($updateUtilisateurPassword);
    $em->flush();
    return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
   }

}