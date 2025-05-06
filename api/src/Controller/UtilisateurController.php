<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;

final class UtilisateurController extends AbstractController
{

    /**
     * Permet de récupérer l'ensemble des utilisateurs
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs', name: 'utilisateurs', methods: ['GET'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour voir les utilisateurs")]
    public function getAllUtilisateurs(UtilisateurRepository $utilisateurRepository, SerializerInterface $serializer): JsonResponse
    {
        $utilisateursList = $utilisateurRepository->findAll();
        $jsutilisateursList = $serializer->serialize($utilisateursList, 'json', ["groups" => "getUtilisateurs"]);
        return new JsonResponse($jsutilisateursList, Response::HTTP_OK, [], true);
    }

    /**
     * Permet de récupérer un utilisateur grace à son identifiant
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs/{id}', name: 'detailUtilisateur', methods: ['GET'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour voir un utilisateur")]
    public function getUtilisateur(Utilisateur $utilisateur, SerializerInterface $serializer): JsonResponse
    {
        $jsonutilisateur = $serializer->serialize($utilisateur, 'json', ["groups" => "getUtilisateurs"]);
        return new JsonResponse($jsonutilisateur, Response::HTTP_OK, [], true);
    }

    /**
     * Permet de créer un utilisateur
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs', name: 'createUtilisateur', methods: ['POST'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour créer un utilisateur")]
    public function createUtilisateur(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $utilisateur = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json');

        $content = $request->toArray();

        $role = $content['role'] ?? "ROLE_USER";

        $utilisateur->setRoles([$role]);

        $plaintextPassword = $utilisateur->getPassword();
        $hashedPassword = $passwordHasher->hashPassword($utilisateur, $plaintextPassword);
        $utilisateur->setPassword($hashedPassword);

        $em->persist($utilisateur);
        $em->flush();

        $location = $urlGenerator->generate('detailUtilisateur', ['id' => $utilisateur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

        $jsonutilisateur = $serializer->serialize($utilisateur, 'json', ['groups' => 'getUtilisateurs']);

        return new JsonResponse($jsonutilisateur, Response::HTTP_CREATED, ['Location' => $location], true);
    }

    /**
     * Permet de supprimer un utilisateur grace à son identifiant
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs/{id}', name: 'deleteUtilisateur', methods: ['DELETE'])]
    #[IsGranted("ROLE_USER", message: "Vous n'avez pas les droits suffisants pour supprimer un utilisateur")]
    public function deleteUtilisateur(
        Utilisateur $utilisateur,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof Utilisateur) {
            return new JsonResponse(['error' => 'Utilisateur authentifié invalide.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if ($user->getId() !== $utilisateur->getId()) {
            return new JsonResponse(
                ['error' => 'Vous ne pouvez supprimer que votre propre compte.'],
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        try {
            $em->remove($utilisateur);
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la suppression du compte.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['success' => 'Compte supprimé avec succès.'], JsonResponse::HTTP_NO_CONTENT);
    }

    /**
     * Permet de modifier les informations d'un utilisateur grace à son identifiant
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs/{id}', name: "updateUtilisateurs", methods: ['PUT'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour modifier un utilisateur")]
    public function updateUtilisateur(Request $request, SerializerInterface $serializer, Utilisateur $currentUtilisateur, EntityManagerInterface $em): JsonResponse
    {
        $updateUtilisateur = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentUtilisateur]);

        $em->persist($updateUtilisateur);
        $em->flush();
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    /**
     * Permet de modifier le mot de passe d'un utilisateur grace à son identifiant
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/utilisateurs/{id}/password', name: "updateUtilisateursPassword", methods: ['PUT'])]
    #[IsGranted("ROLE_USER", message: "Vous n'avez pas les droits suffisant pour modifier un mot de passe utilisateur")]
    public function updateUtilisateurPassword(
        Request $request,
        Utilisateur $currentUtilisateur,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof Utilisateur) {
            return new JsonResponse(['error' => 'Utilisateur authentifié invalide.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if ($user->getId() !== $currentUtilisateur->getId()) {
            return new JsonResponse(['error' => 'Vous ne pouvez pas modifier le mot de passe d\'un autre utilisateur.'], JsonResponse::HTTP_FORBIDDEN);
        }

        $content = $request->toArray();

        if (empty($content['ancienPassword']) || empty($content['nouveauPassword'])) {
            return new JsonResponse(['error' => 'Ancien et nouveau mot de passe sont requis'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $ancienPassword = $content['ancienPassword'];
        $nouveauPassword = $content['nouveauPassword'];

        if (!$passwordHasher->isPasswordValid($currentUtilisateur, $ancienPassword)) {
            return new JsonResponse(['error' => 'Ancien mot de passe incorrect.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $hashedPassword = $passwordHasher->hashPassword($currentUtilisateur, $nouveauPassword);
        $currentUtilisateur->setPassword($hashedPassword);

        try {
            $em->persist($currentUtilisateur);
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la mise à jour du mot de passe.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['success' => 'Mot de passe mis à jour avec succès.'], JsonResponse::HTTP_OK);
    }

    /**
     * Permet de verifier l'existence d'un utilisateur lors de la connexion et lui attribuer un token
     */
    #[OA\Tag(name: 'Utilisateurs')]
    #[Security(name: 'Bearer')]
    #[Route('/api/login', name: 'verifyUtilisateur', methods: ['POST'])]
    public function verifyUtilisateur(
        Request $request,
        UtilisateurRepository $utilisateurRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $JWTManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $content = $request->toArray();
        $email = $content['email'] ?? null;
        $password = $content['password'] ?? null;

        if (empty($email) || empty($password)) {
            return new JsonResponse(['message' => 'Email et mot de passe sont requis.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $utilisateur = $utilisateurRepository->findOneBy(['email' => $email]);

        if (!$utilisateur) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$passwordHasher->isPasswordValid($utilisateur, $password)) {
            return new JsonResponse(['message' => 'Mot de passe incorrect.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $token = $JWTManager->create($utilisateur);
        } catch (\Exception $e) {
            throw new AuthenticationException('Erreur lors de la génération du token JWT.');
        }

        $jsonUtilisateur = $serializer->serialize($utilisateur, 'json', ['groups' => 'getUtilisateurs']);

        return new JsonResponse([
            'token' => $token,
            'utilisateur' => json_decode($jsonUtilisateur),
            'redirect' => '/monEspace'
        ]);
    }

    /**
     * Permet à un utilisateur de créer son compte
     */
    #[OA\Tag(name: 'Authentification')]
    #[Route('/api/register', name: 'userRegister', methods: ['POST'])]
    public function register(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        UrlGeneratorInterface $urlGenerator
    ): JsonResponse {
        try {
            $utilisateur = $serializer->deserialize($request->getContent(), Utilisateur::class, 'json');

            $utilisateur->setRoles(['ROLE_USER']);

            $plaintextPassword = $utilisateur->getPassword();
            if (!$plaintextPassword) {
                return new JsonResponse(['error' => 'Le mot de passe est requis'], Response::HTTP_BAD_REQUEST);
            }
            $hashedPassword = $passwordHasher->hashPassword($utilisateur, $plaintextPassword);
            $utilisateur->setPassword($hashedPassword);

            $em->persist($utilisateur);
            $em->flush();

            $jsonUtilisateur = $serializer->serialize($utilisateur, 'json', ['groups' => 'getUtilisateurs']);
            $location = $urlGenerator->generate('detailUtilisateur', ['id' => $utilisateur->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

            return new JsonResponse($jsonUtilisateur, Response::HTTP_CREATED, ['Location' => $location], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de l\'inscription : ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
