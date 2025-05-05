<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

class ImagesController extends AbstractController
{
    /**
     * Route pour récupérer une image spécifique par son ID (nom de fichier)
     */
    #[OA\Tag(name: 'Images')]
    #[Route('/api/images/{id}', name: 'get_image_by_id', methods: ['GET'])]
    public function getImageById(string $id): Response
    {
        $imagesDirectory = $this->getParameter('kernel.project_dir') . '/public/images/produits';

        $extensions = ['jpg', 'jpeg', 'png','webp']; 
        $imagePath = null;

        foreach ($extensions as $extension) {
            $potentialPath = $imagesDirectory . '/' . $id . '.' . $extension;
            if (file_exists($potentialPath)) {
                $imagePath = $potentialPath;
                break;
            }
        }

        if (!$imagePath) {
            return new JsonResponse(['error' => 'Image introuvable.'], Response::HTTP_NOT_FOUND);
        }

        return new Response(file_get_contents($imagePath), Response::HTTP_OK, [
            'Content-Type' => mime_content_type($imagePath),
            'Content-Disposition' => 'inline; filename="' . basename($imagePath) . '"',
        ]);
    }
}