# Referencia de Iconos Válidos de Lucide React

## Iconos Disponibles en lucide-react (Versión 0.292.0)

### Navegación
- `Home` - Casa
- `Menu` - Menú hamburguesa
- `ChevronDown` - Flecha abajo
- `ChevronUp` - Flecha arriba
- `ChevronLeft` - Flecha izquierda
- `ChevronRight` - Flecha derecha
- `MoreVertical` - Más vertical
- `MoreHorizontal` - Más horizontal

### Búsqueda y Filtros
- `Search` - Buscar
- `Filter` - Filtro
- `Sliders` - Deslizadores

### Personas y Negocios
- `User` - Usuario
- `Users` - Múltiples usuarios
- `UserCheck` - Usuario verificado
- `UserX` - Usuario eliminado
- `Building2` - Edificio
- `Building` - Edificio alternativo
- `Briefcase` - Portafolio

### Finanzas
- `DollarSign` - Dólar
- `Euro` - Euro
- `Coins` - Monedas
- `TrendingUp` - Tendencia al alza
- `TrendingDown` - Tendencia a la baja
- `BarChart3` - Gráfico de barras
- `LineChart` - Gráfico de líneas
- `PieChart` - Gráfico de pastel
- `Calculator` - Calculadora

### Comunicación
- `MessageCircle` - Mensaje circular
- `Mail` - Correo
- `Phone` - Teléfono
- `Send` - Enviar (✓ Usar en lugar de MessageCircle para WhatsApp)
- `Share2` - Compartir

### Ubicación
- `MapPin` - Marcador de mapa
- `Globe` - Globo
- `Navigation` - Navegación

### Acciones
- `Download` - Descargar
- `Upload` - Cargar
- `Trash2` - Papelera
- `Edit` - Editar
- `Copy` - Copiar
- `Eye` - Ver
- `EyeOff` - No ver
- `RefreshCw` - Actualizar
- `Zap` - Rayo

### Alertas y Estados
- `AlertCircle` - Alerta circular
- `CheckCircle` - Círculo verificado
- `XCircle` - Círculo con X
- `Info` - Información
- `HelpCircle` - Ayuda

### Otros
- `Mountain` - Montaña
- `Loader` - Cargador
- `Loader2` - Cargador alternativo
- `Plus` - Más
- `X` - Cerrar

## Iconos NO VÁLIDOS (Evitar)

❌ `Handshake` - No existe
❌ `Heart` - (Sí existe pero no se recomienda)
❌ `Star` - No existe en esta versión
❌ `Award` - Podría no existir

## Alternativas Correctas

| Uso | Icono Válido |
|-----|------|
| Contactar compradores | `Send` o `Mail` |
| Verificado | `CheckCircle` |
| No verificado | `XCircle` |
| Múltiples opciones | `Sliders` |
| Mano/Apretón | `Send` (alternativa visual) |
| Negocios | `Briefcase` o `Building2` |

## Ejemplos de Uso Correcto

```javascript
import { 
  Home, 
  Search, 
  Users,        // ✓ Correcto
  TrendingUp, 
  Calculator, 
  MessageCircle,
  Mail,
  Send,         // ✓ Para enviar/compartir
  MapPin,
  Globe,
  RefreshCw
} from 'lucide-react'
```

## Cómo Verificar Nuevos Iconos

1. Visita: https://lucide.dev
2. Busca el nombre del icono
3. Si aparece, puedes usarlo
4. Si no aparece, busca un sinónimo

---

**Última actualización**: 2024
