<?php

namespace App\Entity;

use App\Repository\DetailReservationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DetailReservationRepository::class)]
class DetailReservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'detailReservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["getReservation"])]
    private ?Produit $idProduit = null;

    #[ORM\ManyToOne(inversedBy: 'detailReservations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Reservation $idReservation = null;

    #[ORM\Column]
    #[Groups(["getReservation"])]
    private ?int $quantite = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdProduit(): ?Produit
    {
        return $this->idProduit;
    }

    public function setIdProduit(?Produit $idProduit): static
    {
        $this->idProduit = $idProduit;

        return $this;
    }

    public function getIdReservation(): ?Reservation
    {
        return $this->idReservation;
    }

    public function setIdReservation(?Reservation $idReservation): static
    {
        $this->idReservation = $idReservation;

        return $this;
    }

    public function getQuantite(): ?int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {
        $this->quantite = $quantite;

        return $this;
    }
}