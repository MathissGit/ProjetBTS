<?php

namespace App\Entity;

use App\Repository\StatusReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StatusReservationRepository::class)]
class StatusReservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, reservation>
     */
    #[ORM\OneToMany(targetEntity: reservation::class, mappedBy: 'statusReservation')]
    private Collection $status;

    #[ORM\Column(length: 255)]
    #[Groups("getReservation")]
    private ?string $label = null;

    public function __construct()
    {
        $this->status = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, reservation>
     */
    public function getStatus(): Collection
    {
        return $this->status;
    }

    public function addStatus(reservation $status): static
    {
        if (!$this->status->contains($status)) {
            $this->status->add($status);
            $status->setStatusReservation($this);
        }

        return $this;
    }

    public function removeStatus(reservation $status): static
    {
        if ($this->status->removeElement($status)) {
            // set the owning side to null (unless already changed)
            if ($status->getStatusReservation() === $this) {
                $status->setStatusReservation(null);
            }
        }

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }
}
