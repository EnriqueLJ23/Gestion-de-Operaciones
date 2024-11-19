import {
    Loader2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTransition } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createEvaluacion } from '@/app/actions/incidencias';


const EvaluacionDialog = ({ incidenciaId, isOpen, setIsOpen  }) => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
  
    const convertRatingToScore = (rating) => {
      const ratingScores = {
        excellent: 5,
        good: 4,
        regular: 3
      }
      return ratingScores[rating]
    }
  
    const convertTimeToScore = (timeRating) => {
      const timeScores = {
        fast: 5,
        ontime: 4,
        slow: 2
      }
      return timeScores[timeRating]
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      
      // Convertir las calificaciones cualitativas a numéricas
      const calificacionTecnico = convertRatingToScore(formData.get('calificacion_tecnico'))
      const tiempoRespuesta = convertTimeToScore(formData.get('tiempo_respuesta'))
      
      // Actualizar el FormData con los valores numéricos
      formData.set('calificacion_tecnico', calificacionTecnico.toString())
      formData.set('tiempo_respuesta', tiempoRespuesta.toString())
      formData.set('reporteId', incidenciaId.toString())
  
      startTransition(async () => {
        const result = await createEvaluacion(formData)
        
        if (result.success) {
          toast({
            title: "Evaluación enviada",
            description: "Gracias por tu evaluación.",
            variant: "default",
          })
          setIsOpen(false)
        } else {
          toast({
            title: "Error",
            description: "No se pudo enviar la evaluación.",
            variant: "destructive",
          })
        }
      })
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
           <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          Evaluar Solución
        </Button>
      </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Evaluar Solución</DialogTitle>
            <DialogDescription>
              Por favor evalúa la calidad del servicio recibido
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Calificación del Técnico</Label>
              <RadioGroup 
                name="calificacion_tecnico"
                defaultValue="good"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">Excelente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">Bueno</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular</Label>
                </div>
              </RadioGroup>
            </div>
  
            <div className="space-y-2">
              <Label>Tiempo de Respuesta</Label>
              <RadioGroup 
                name="tiempo_respuesta"
                defaultValue="ontime"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Rápido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ontime" id="ontime" />
                  <Label htmlFor="ontime">A tiempo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slow" id="slow" />
                  <Label htmlFor="slow">Demorado</Label>
                </div>
              </RadioGroup>
            </div>
  
            <div className="space-y-2">
              <Label>Comentarios adicionales</Label>
              <Textarea 
                name="comentarios"
                placeholder="Escribe tus comentarios aquí..."
                className="min-h-[100px]"
              />
            </div>
  
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Evaluación"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default EvaluacionDialog