<?php

namespace App\Entity;

use App\Repository\ProduitRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProduitRepository::class)]
class Produit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["getProduits", "getReservation"])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(["getProduits", "getReservation"])]
    private ?string $nom = null;

    #[ORM\Column]
    #[Groups(["getProduits", "getReservation"])]
    private ?float $prix = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["getProduits"])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(["getProduits"])]
    private ?int $stock = null;

    /**
     * @var Collection<int, DetailReservation>
     */
    #[ORM\OneToMany(targetEntity: DetailReservation::class, mappedBy: 'idProduit')]
    private Collection $detailReservations;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['getProduits', 'getImageURL'])]
    private ?string $imageURL = null;

    public function __construct()
    {
        $this->detailReservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;

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
            $detailReservation->setIdProduit($this);
        }

        return $this;
    }

    public function removeDetailReservation(DetailReservation $detailReservation): static
    {
        if ($this->detailReservations->removeElement($detailReservation)) {
            // set the owning side to null (unless already changed)
            if ($detailReservation->getIdProduit() === $this) {
                $detailReservation->setIdProduit(null);
            }
        }

        return $this;
    }

    public function getImageURL(): ?string
    {
        return $this->imageURL;
    }

    public function setImageURL(string $imageURL): static
    {
        $this->imageURL = $imageURL;

        return $this;
    }
}
