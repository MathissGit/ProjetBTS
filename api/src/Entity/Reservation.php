<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["getReservation"])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(["getReservation"])]
    private ?\DateTimeInterface $date_reservation = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["getReservation"])]
    private ?utilisateur $id_utilisateur = null;

    /**
     * @var Collection<int, DetailReservation>
     */
    #[ORM\OneToMany(targetEntity: DetailReservation::class, mappedBy: 'idReservation')]
    private Collection $detailReservations;

    #[ORM\ManyToOne(inversedBy: 'status')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["getReservation"])]
    private ?StatusReservation $statusReservation = null;

    public function __construct()
    {
        $this->detailReservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateReservation(): ?\DateTimeInterface
    {
        return $this->date_reservation;
    }

    public function setDateReservation(\DateTimeInterface $date_reservation): static
    {
        $this->date_reservation = $date_reservation;

        return $this;
    }

    public function getIdUtilisateur(): ?utilisateur
    {
        return $this->id_utilisateur;
    }

    public function setIdUtilisateur(?utilisateur $id_utilisateur): static
    {
        $this->id_utilisateur = $id_utilisateur;

        return $this;
    }

    /**
     * @return Collection<int, DetailReservation>
     */
    public function getDetailReservations(): Collection
    {
        return $this->detailReservations;
    }

    public function addDetailReservation(DetailReservation $detailReservation): static
    {
        if (!$this->detailReservations->contains($detailReservation)) {
            $this->detailReservations->add($detailReservation);
            $detailReservation->setIdReservation($this);
        }

        return $this;
    }

    public function removeDetailReservation(DetailReservation $detailReservation): static
    {
        if ($this->detailReservations->removeElement($detailReservation)) {
            // set the owning side to null (unless already changed)
            if ($detailReservation->getIdReservation() === $this) {
                $detailReservation->setIdReservation(null);
            }
        }

        return $this;
    }

    public function getStatusReservation(): ?StatusReservation
    {
        return $this->statusReservation;
    }

    public function setStatusReservation(?StatusReservation $statusReservation): static
    {
        $this->statusReservation = $statusReservation;

        return $this;
    }
}
