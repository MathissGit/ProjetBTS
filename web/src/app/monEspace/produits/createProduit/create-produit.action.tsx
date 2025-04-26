export async function createProductAction(productData: {
        nom: string;
        prix: number;
        description: string;
        stock: number;
        image_url: string;
    }): Promise<number | null> {
        try {
        const token = localStorage.getItem("auth_token");
    
        if (!token) throw new Error("Token d'authentification non trouvé");
    
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/produits`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
            }
        );
    
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Erreur création produit");
        }
    
        const newProduct = await response.json();
        return newProduct.id;
    } catch (error) {
        console.error("Erreur création:", error);
        return null;
    }
}
    
export async function uploadImageLocally(productId: string, imageFile: File) {
        try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", productId);
    
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
    
        if (!response.ok) {
            console.error("Erreur upload image");
            return false;
        }
  
      return true;
    } catch (error) {
      console.error("Erreur upload:", error);
      return false;
    }
}
  