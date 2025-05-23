<?php

namespace App\Controller;

use App\Repository\StatusReservationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;

final class StatusController extends AbstractController
{
    /**
     * Permet de récupérer le status des réservations actuel
     */
    #[OA\Tag(name: 'Réservations')]
    #[Security(name: 'Bearer')]
    #[Route('/api/status', name: 'getStatus', methods:['GET'])]
    #[IsGranted("ROLE_ADMIN", message: "Vous n'avez pas les droits suffisant pour voir les status")]
    public function getStatus(StatusReservationRepository $statusReservationRepository, SerializerInterface $serializer): JsonResponse 
    {
        $statusList = $statusReservationRepository->findAll();
        $JsonStatusList = $serializer->serialize($statusList, 'json', ['groups' => 'getStatus']);
        return new JsonResponse($JsonStatusList, Response::HTTP_OK, [], true);
    }
}
