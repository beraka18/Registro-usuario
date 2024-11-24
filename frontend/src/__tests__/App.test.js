import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders navigation bar', () => {
    render(<App />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Carrito')).toBeInTheDocument();
  });

  test('shows login form when Usuario link is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Usuario'));
    expect(screen.getByText('Inicio de sesión de Usuario')).toBeInTheDocument();
  });

  test('alerts when login is submitted with empty fields', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
    fireEvent.click(screen.getByText('Usuario'));
    fireEvent.click(screen.getByText('Iniciar sesión'));
    expect(window.alert).toHaveBeenCalledWith('Por favor, ingresa usuario y contraseña');
  });
});