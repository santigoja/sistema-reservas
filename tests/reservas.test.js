// tests/reservas.test.js

function validarReservaExistente(reservas, nueva) {
    return reservas.some(r =>
        r.espacio === nueva.espacio &&
        r.fecha === nueva.fecha &&
        r.hora === nueva.hora
    );
}

test("No debe permitir reservas duplicadas", () => {
    const reservas = [{ espacio: "Aula 101", fecha: "2025-10-16", hora: "10:00" }];
    const nueva = { espacio: "Aula 101", fecha: "2025-10-16", hora: "10:00" };
    expect(validarReservaExistente(reservas, nueva)).toBe(true);
});
