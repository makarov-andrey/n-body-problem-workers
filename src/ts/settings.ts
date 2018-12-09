export default {
    bodies: (() => {
        let scale = 3e8;
        let offsetX = scale * 2;
        let offsetY = scale * 2;
        let p1 = 0.392955;
        let p2 = 0.097579;

        return [
            {
                mass: 2e35,
                position: [
                    -1 * scale + offsetX,
                    offsetY
                ],
                velocity: [
                    p1 * scale,
                    p2 * scale
                ]
            },
            {
                mass: 2e35,
                position: [
                    scale + offsetX,
                    offsetY
                ],
                velocity: [
                    p1 * scale,
                    p2 * scale
                ]
            },
            {
                mass: 2e35,
                position: [
                    offsetX,
                    offsetY
                ],
                velocity: [
                    -2 * p1 * scale,
                    -2 * p2 * scale
                ]
            }
        ]
    })(), // начальные стейты тел в системе
    dimensionsAmount: 2, // мерность пространства
    admissibleMeasurementError: 1000, // допустимая погрешность todo найти заебатую
    maxIntegrationStep: Math.pow(2, -15), // максимальный шаг интеграции по времени
    integrationTime: Math.pow(2, -13), // время интегрирования одного цикла проверки погрешности
    timeCoefficient: 1, // показатель течения времени
    renderingScale: 3e6, // масштаб отрисовки
};