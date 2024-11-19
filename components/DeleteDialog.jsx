import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

import { useToast } from "@/hooks/use-toast"

const DeleteDialog = ({data, deleteTh}) => { 
    const { toast } = useToast()
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild><Button onClick={()=> {}} variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Estás Absolutamente Seguro de esto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion no se puede deshacer. Lo que decidas afectará el destino del mundo por el resto de la eternidad.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            try {
                                const deletedA = await deleteTh(data);
                                toast({
                                    title: "Exito",
                                    variant: "positive",
                                    description: deletedA.message,
                                });
                            } catch (error) {
                                toast({
                                    title: "Error",
                                    variant: "destructive",
                                    description: error.toString(),
                                });
                            }
                        }}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteDialog