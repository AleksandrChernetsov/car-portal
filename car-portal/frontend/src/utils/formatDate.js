/**
 * Форматирует дату для отображения.
 * @param {string} dateString - строка с датой
 * @returns {string} отформатированная дата
 */
export const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};