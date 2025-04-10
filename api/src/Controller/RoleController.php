<?php

namespace App\Controller;

use App\Repository\RoleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class RoleController extends AbstractController
{
    // Getteur sur tout les role
    #[Route('/api/admin/role', name: 'roles', methods: ['GET'])]
    public function getAllProduits(RoleRepository $roleRepository, SerializerInterface $serializer): JsonResponse
    {
        $roleList = $roleRepository->findAll();
        $jsRoleListe = $serializer->serialize($roleList, 'json', ['groups' => 'getRoles']);
        return new JsonResponse($jsRoleListe, Response::HTTP_OK, [], true);
    }
}
