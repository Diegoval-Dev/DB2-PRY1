import { useMutation } from "@tanstack/react-query"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface Props {
    refetch: () => void
}

const BulkIngredientUpload = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append("file", file)

            await axios.post(`${API_URL}/ingredients/bulk`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        },
        onSuccess: () => {
            alert("Ingredientes cargados exitosamente")
            refetch()
        },
        onError: () => {
            alert("Error al cargar el archivo CSV")
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            mutation.mutate(file)
        }
    }

    return (
        <div>
            <h3>Carga Masiva de Ingredientes (CSV)</h3>
            <label htmlFor="file-upload">Seleccione un archivo CSV:</label>
            <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
            {mutation.isPending && <p>Subiendo archivo...</p>}
        </div>
    )
}

export default BulkIngredientUpload
