import { render, screen } from '@testing-library/react';
import App from '../App';

test('debe mostrar el texto de bienvenida', () => {
    render(<App />);
    const textoDeBienvenida = screen.getByText(/Bienvenido a Stop Jeans/i);
    expect(textoDeBienvenida).toBeInTheDocument();
});