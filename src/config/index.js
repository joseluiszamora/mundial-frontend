const configService = {
  apiUrl: 'http://localhost:3000/api/',
  // apiUrl: 'http://proyecto-nuevo.miteleferico.bo/api',
  publicUrl: 'http://sspv2.miteleferico.bo/',
  apiTeleferico: 'http://rrhh.miteleferico.bo/servicios/',
  imgTeleferico: 'http://rrhh.miteleferico.bo/images/personal/',
  // apiFifa: 'https://api.fifa.com/api/v1/live/football/',
  apiFifa: 'https://api.fifa.com/api/v1/',

  menu: [
    {
      href: '/',
      icon: 'home',
      title: 'Inicio',
      active: true
    },
    /* {
      icon: 'person',
      title: 'Linea',
      items: [
        { title: 'Linea/:codigo_linea', href: '/linea', icon: '' }
      ]
    },
    {
      icon: 'person',
      title: 'Proyectos',
      items: [
        { title: 'Proyectos Fase 1', href: '/usuarios', icon: '' },
        { title: 'Proyectos Fase 2', href: '/usuarios', icon: '' }
      ]
    },
    {
      icon: 'person',
      title: 'Usuarios',
      items: [
        { title: 'Listado de Usuarios', href: '/usuarios', icon: '' },
        { title: 'Nuevo Usuario', href: '/nuevo_usuario', icon: '' }
      ]
    }, */
    {
      icon: 'edit',
      title: 'Tareas',
      items: [
        { title: 'Crear Tareas', href: '/nueva_tarea_bloque', icon: '' }
      ]
    },
    {
      icon: 'edit',
      title: 'Revisiones',
      items: [
        { title: 'Listado de Revisiones', href: '/revisiones', icon: '' },
        { title: 'Nueva Revisión', href: '/nueva_revision', icon: '' }
      ]
    },
    {
      icon: 'edit',
      title: 'Actividades Fase 2',
      items: [
        { title: 'Listado', href: '/actividad_fase', icon: '' }
      ]
    },
    /* {
      icon: 'assignment',
      title: 'Reportes',
      items: [
        { title: 'Mapa', href: '/mapa', icon: '' },
        { title: 'Reportes por Fase', href: '/reportefase', icon: '' },
        { title: 'Reportes por Obra', href: '/reporteobra', icon: '' }
      ]
    }, */
    {
      icon: 'assignment',
      title: 'Importar',
      items: [
        { title: 'Importar archivos Excel', href: '/excel', icon: '' }
      ]
    }
    /* {
      icon: 'timeline',
      title: 'Programación',
      items: [
        { title: 'Programación', href: '/programacion', icon: '' }
      ]
    },
    {
      icon: 'timeline',
      title: 'Graficos',
      items: [
        { title: 'Avance', href: '/avance', icon: '' },
        { title: 'Avance por Linea', href: '/avancelinea', icon: '' }
      ]
    } */
  ],
  geToken () {
    return localStorage.getItem('token')
  }
}

export default configService
