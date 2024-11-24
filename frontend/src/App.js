// App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import logo from './logo.png';

function App() {
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [usuarioRegistrado, setUsuarioRegistrado] = useState('');
  const [correoRegistrado, setCorreoRegistrado] = useState('');
  const [contraseñaRegistrado, setContraseñaRegistrado] = useState('');
  const [direccionRegistrado, setDireccionRegistrado] = useState('');
  const [isUsuarioLogin, setIsUsuarioLogin] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false);

  useEffect(() => {
    if (isUsuarioLogin) {
      obtenerUsuarios();  // Cargar usuarios cuando el inicio de sesión sea exitoso
    }
  }, [isUsuarioLogin]);

  // Obtener la lista de usuarios desde el backend
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios', error);
    }
  };

  // Manejo de login
  const handleLoginUsuario = async (e) => {
    e.preventDefault();
    if (usuario && contraseña) {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contraseña })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.mensaje);
        setIsUsuarioLogin(true);  // Cambiar el estado a usuario logueado
      } else {
        alert('Credenciales incorrectas');
      }
    } else {
      alert('Por favor, ingresa usuario y contraseña');
    }
  };

  // Registro de usuario
  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!usuarioRegistrado || !correoRegistrado || !contraseñaRegistrado || !direccionRegistrado) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevoUsuario = {
      usuario: usuarioRegistrado,
      correo: correoRegistrado,
      contraseña: contraseñaRegistrado,
      direccion: direccionRegistrado
    };

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        alert('Usuario registrado exitosamente');
        setUsuarios([...usuarios, nuevoUsuario]);
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      alert('Hubo un error al registrar usuario');
      console.error(error);
    }
  };

  // Eliminar usuario
  const handleEliminarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioRegistrado) {
      alert("Por favor, ingrese un nombre de usuario");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario: usuarioRegistrado })
      });

      if (response.ok) {
        alert('Usuario eliminado exitosamente');
        setUsuarios(usuarios.filter(user => user.usuario !== usuarioRegistrado));  // Filtrar el usuario eliminado
      } else {
        alert('Error al eliminar usuario');
      }
    } catch (error) {
      alert('Hubo un error al eliminar usuario');
      console.error(error);
    }
  };

  // Mostrar u ocultar el formulario de usuario
  const toggleMostrarFormularioUsuario = () => {
    setMostrarFormularioUsuario(!mostrarFormularioUsuario);
  };

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Logo Stop Jeans" className="logo" />
        <h1>Bienvenido a Stop Jeans</h1>
        <nav>
          <a href="index.html">Inicio</a>
          <a href="producto.html">Productos</a>
          <a href="#" onClick={(e) => { e.preventDefault(); toggleMostrarFormularioUsuario(); }}>Usuario</a>
          <a id="carrito" href="carrito.html">
            Carrito <span id="cantidad-carrito">{carrito.length}</span>
          </a>
        </nav>
      </header>

      <main>
        <h2>Nuestra Colección</h2>
        <p>Explora los mejores productos de moda en Stop Jeans</p>

        {mostrarFormularioUsuario && (
          <div>
            {!isUsuarioLogin ? (
              <div className="formulario">
                <h3>Inicio de sesión de Usuario</h3>
                <form onSubmit={handleLoginUsuario}>
                  <label>Usuario:</label>
                  <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                  <label>Contraseña:</label>
                  <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                  <button type="submit">Iniciar sesión</button>
                </form>
              </div>
            ) : (
              <p>¡Bienvenido, {usuario}!</p>
            )}

            {isUsuarioLogin && (
              <div className="formulario">
                <h3>Registro de Usuario</h3>
                <form onSubmit={handleRegistro}>
                  <label>Usuario:</label>
                  <input type="text" value={usuarioRegistrado} onChange={(e) => setUsuarioRegistrado(e.target.value)} required />
                  <label>Correo electrónico:</label>
                  <input type="email" value={correoRegistrado} onChange={(e) => setCorreoRegistrado(e.target.value)} required />
                  <label>Contraseña:</label>
                  <input type="password" value={contraseñaRegistrado} onChange={(e) => setContraseñaRegistrado(e.target.value)} required />
                  <label>Dirección:</label>
                  <input type="text" value={direccionRegistrado} onChange={(e) => setDireccionRegistrado(e.target.value)} required />
                  <button type="submit">Registrar</button>
                </form>
              </div>
            )}

            {isUsuarioLogin && (
              <div className="formulario">
                <h3>Eliminar Usuario</h3>
                <form onSubmit={handleEliminarUsuario}>
                  <label>Usuario:</label>
                  <input type="text" value={usuarioRegistrado} onChange={(e) => setUsuarioRegistrado(e.target.value)} required />
                  <button type="submit">Eliminar</button>
                </form>
              </div>
            )}

            {isUsuarioLogin && (
              <div className="formulario">
                <h3>Usuarios Registrados</h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Correo</th>
                      <th>Contraseña</th>
                      <th>Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.Nombre}</td>
                        <td>{user.Correo_electronico}</td>
                        <td>{user.Contraseña}</td>
                        <td>{user.Direccion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2024 Stop Jeans. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
