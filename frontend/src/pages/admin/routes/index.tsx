import RouteForm from "@components/admin/routes/RouteForm";
import RouteList from "@components/admin/routes/RouteList";
import { useQueryClient } from "@tanstack/react-query";

const RoutesPage = () => {
    const queryClient = useQueryClient();

    return (
        <div>
            <h1>Gestión de Rutas</h1>
            <RouteForm refetch={() => queryClient.invalidateQueries({ queryKey: ["routes"] })} />
            <RouteList />
        </div>
    );
};

export default RoutesPage;
