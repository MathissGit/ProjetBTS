<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
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
}
