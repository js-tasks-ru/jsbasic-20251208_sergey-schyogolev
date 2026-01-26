/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this.render();
    this.deleteRow();
  }

  render() {
    this.elem = document.createElement("table");
    this.elem.innerHTML = `
      <thead>
        <tr>
          <th>Имя</th>
          <th>Возраст</th>
          <th>Зарплата</th>
          <th>Город</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      </tbody>`;

    const tBody = this.elem.querySelector("tbody");
    let resultRow = "";

    this.rows.forEach(({ name, age, salary, city }) => {
      resultRow += `<tr>
          <td>${name}</td>
          <td>${age}</td>
          <td>${salary}</td>
          <td>${city}</td>
          <td><button>X</button></td>
        </tr>`;
    });

    tBody.innerHTML = resultRow;

    return this.elem;
  }

  deleteRow() {
    const buttons = this.elem.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const row = this.closest("tr");
        row.remove();
      });
    });
  }
}
