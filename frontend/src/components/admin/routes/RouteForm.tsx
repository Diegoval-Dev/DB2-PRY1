import { useMutation } from "@tanstack/react-query";
import { createRoute } from "@api/admin/routesApi";
import { useForm } from "react-hook-form";
import { RouteFormData } from "@interfaces/admin/RoutesTypes";
import { adaptRouteToRequest } from "@api/admin/routesApi";

interface Props {
    refetch: () => void;
}

const RouteForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createRoute,
        onSuccess: () => {
            refetch();
            reset();
        }
    });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<RouteFormData>({
        defaultValues: {
            ID: "",
            origin: "",
            destination: "",
            distance: 0,
            transportType: ""
        }
    });

    const onSubmit = (data: RouteFormData) => {
        const adapted = adaptRouteToRequest(data);
        mutation.mutate(adapted);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("ID")} />
            <input type="text" placeholder="Origen (ID Ubicación)" {...register("origin")} />
            <input type="text" placeholder="Destino (ID Ubicación)" {...register("destination")} />
            <input type="number" placeholder="Distancia" {...register("distance")} />
            <select {...register("transportType")}>
                <option value="">Seleccione tipo</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Express">Express</option>
                <option value="Normal">Normal</option>
            </select>
            <button type="submit">Guardar Ruta</button>
        </form>
    );
};

export default RouteForm;
