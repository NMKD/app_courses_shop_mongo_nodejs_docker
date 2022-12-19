const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat("ru-Ru", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

// slider for main
const container = document.querySelector(".header");
const images = [
  "https://images.unsplash.com/photo-1544256718-3bcf237f3974?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1546900703-cf06143d1239?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503437313881-503a91226402?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8&w=1000&q=80",
];
const headers = ["Frontend", "HTML и CSS", "JavaScript", "Node.js", "React"];

if (container) {
  window.addEventListener("DOMContentLoaded", () => {
    headers.forEach((slide, i) => {
      document.querySelector(".header").insertAdjacentHTML(
        "beforeend",
        `<div class="slide" style="background-image: url(${images[i]});">
              <h3>${slide}</h3>
            </div>`
      );
    });
    document.querySelectorAll('.slide')[3].classList.add('active_flex')
  });

  container.addEventListener("click", (e) => {
    clearActivaClass();
    e.target.classList.add("active_flex");
  });

  function clearActivaClass() {
    const slider = document.querySelectorAll(".slide");
    slider.forEach((element) => {
      element.classList.remove("active_flex");
    });
  }
}

if (document.querySelectorAll(".tabs")) {
  M.Tabs.init(document.querySelectorAll(".tabs"));
}

const CARD_HTML = document.querySelector("#card");

if (CARD_HTML) {
  CARD_HTML.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("js-remove")) {
      const id = e.target.dataset.id;
      fetch(`/card/remove/${id}`, {
        method: "delete",
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(e.target)
          if (result.courses.length) {
            const html = result.courses
              .map((c) => {
                return `
                        <tr>
                        <td>${c.title}</td>
                        <td id="count">${c.count}</td>
                        <td class="price total-table__price">${toCurrency(
                          c.price
                        )}</td>
                        <td>
                            <button class="btn-floating btn-small waves-effect waves-light red js-remove js-remove material-icons" data-id="${
                              c.id
                            }">remove</button>
                        </td>
                        </tr>
                        `;
              })
              .join("");
            CARD_HTML.querySelector("tbody").innerHTML = html;
            document.querySelector("#total-price").textContent = toCurrency(
              result.total
            );
          } else {
            CARD_HTML.innerHTML = `<p>Корзина пуста</p>`;
          }
        });
    }
  });
}
