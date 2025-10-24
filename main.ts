type OrgId = string;

interface Address {
  city: string;
  street: string;
  build: string;
}

interface Org {
  id: OrgId;
  name: string;
  director: string;
  phone: string;
  address: Address;
}

type SortKey = "name" | "director";
type SortDir = "asc" | "desc";

function uid(): OrgId {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeOrg(o: Partial<Org>): Org {
  return {
    id: o.id ?? uid(),
    name: o.name ?? "",
    director: o.director ?? "",
    phone: o.phone ?? "",
    address: {
      city: o.address?.city ?? "",
      street: o.address?.street ?? "",
      build: o.address?.build ?? "",
    },
  };
}

const seed: Org[] = [
  {
    name: "ООО «Вектор»",
    director: "Иванов И.И.",
    phone: "+7 000 123 45 67",
    address: { city: "Москва", street: "Ленина", build: "1" },
  },
  {
    name: "ИП Сидоров С.С.",
    director: "Сидоров С.С.",
    phone: "+7 000 56 78 99",
    address: { city: "Санкт-Петербург", street: "Невский проспект", build: "2" },
  },
  {
    name: "ООО «ТехноСервис»",
    director: "Петров П.П.",
    phone: "+7 900 111 22 33",
    address: { city: "Казань", street: "Баумана", build: "5" },
  },
  {
    name: "АО «Альфа»",
    director: "Смирнов А.А.",
    phone: "+7 900 444 55 66",
    address: { city: "Екатеринбург", street: "Мира", build: "10" },
  },
  {
    name: "ООО «Ромашка»",
    director: "Кузнецова И.В.",
    phone: "+7 901 777 88 99",
    address: { city: "Новосибирск", street: "Красный проспект", build: "12" },
  },
  {
    name: "ООО «СтройИнвест»",
    director: "Васильев Д.Д.",
    phone: "+7 905 321 00 11",
    address: { city: "Самара", street: "Молодогвардейская", build: "8" },
  },
  {
    name: "ИП Ковалёв Н.Н.",
    director: "Ковалёв Н.Н.",
    phone: "+7 905 555 66 77",
    address: { city: "Ростов-на-Дону", street: "Большая Садовая", build: "3" },
  },
  {
    name: "ООО «Север»",
    director: "Морозов Е.Е.",
    phone: "+7 999 000 11 22",
    address: { city: "Архангельск", street: "Троицкий", build: "7" },
  },
  {
    name: "ООО «ЮгСнаб»",
    director: "Сафронов С.С.",
    phone: "+7 988 420 42 42",
    address: { city: "Краснодар", street: "Красная", build: "15" },
  },
  {
    name: "ЗАО «Волга-Лес»",
    director: "Орлов Г.Г.",
    phone: "+7 987 765 43 21",
    address: { city: "Нижний Новгород", street: "Покровская", build: "9" },
  },
  {
    name: "ООО «Балтика»",
    director: "Никифоров Р.Р.",
    phone: "+7 981 123 45 67",
    address: { city: "Калининград", street: "Ленинский проспект", build: "21" },
  },
  {
    name: "ИП Медведев М.М.",
    director: "Медведев М.М.",
    phone: "+7 985 234 56 78",
    address: { city: "Тверь", street: "Советская", build: "4" },
  },
].map(makeOrg);

class DirectoryApp {
  private items: Org[] = seed;
  private query = "";
  private sortBy: SortKey = "name";
  private sortDir: SortDir = "asc";
  private page = 1;
  private pageSize = 5;
  private editId: OrgId | null = null;

  private $q = document.getElementById("q") as HTMLInputElement;
  private $rows = document.getElementById("rows") as HTMLElement;
  private $prevPage = document.getElementById("prev-page") as HTMLButtonElement;
  private $nextPage = document.getElementById("next-page") as HTMLButtonElement;
  private $pageNum = document.getElementById("page-num") as HTMLElement;
  private $sortName = document.getElementById("sort-name") as HTMLElement;
  private $sortDirName = document.getElementById("arrow-name") as HTMLElement;
  private $sortDirector = document.getElementById("sort-director") as HTMLElement;
  private $sortDirDirector = document.getElementById("arrow-director") as HTMLElement;
  private $add = document.getElementById("add") as HTMLButtonElement;

  private $overlay = document.getElementById("overlay") as HTMLElement;
  private $modalTitle = document.getElementById("modal-title") as HTMLElement;
  private $close = document.getElementById("close") as HTMLButtonElement;
  private $ok = document.getElementById("ok") as HTMLButtonElement;

  private $fName = document.getElementById("f-name") as HTMLInputElement;
  private $fDirector = document.getElementById("f-director") as HTMLInputElement;
  private $fPhone = document.getElementById("f-phone") as HTMLInputElement;
  private $fCity = document.getElementById("f-city") as HTMLInputElement;
  private $fStreet = document.getElementById("f-street") as HTMLInputElement;
  private $fbuild = document.getElementById("f-build") as HTMLInputElement;
  private $form = document.getElementById("card-form") as HTMLInputElement;

  constructor() {
    // навешиваем обработчики событий
    this.$q.addEventListener("input", () => {
      this.query = this.$q.value;
      this.page = 1;
      this.render();
    });
    this.$sortName.addEventListener("click", () => this.toggleSort("name"));
    this.$sortDirector.addEventListener("click", () => this.toggleSort("director"));
    this.$add.addEventListener("click", () => this.openAdd());
    this.$prevPage.addEventListener("click", () => {
      this.page--;
      this.render();
    });
    this.$nextPage.addEventListener("click", () => {
      this.page++;
      this.render();
    });
    this.$rows.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const tr = target.closest("tr") as HTMLTableRowElement | null;
      if (!tr) return;
      const id = tr.getAttribute("data-id") as OrgId;

      if (target.classList.contains(".del")) {
        this.remove(id);
        return;
      }

      if (target.closest('.actions') && target.querySelector('.del')) {
        return
      }

      this.openEdit(id);
    });
    this.$close.addEventListener("click", () => this.closeModal());
    this.$overlay.addEventListener("click", (e) => {
      if (e.target === this.$overlay) this.closeModal();
    });
    this.$form.addEventListener("input", () => {
      this.updateOkDisabled();
    });
    this.$ok.addEventListener("click", () => this.save());

    this.render();
  }

  private filtered(): Org[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter((o) => o.director.toLowerCase().includes(q));
  }

  private sorted(arr: Org[]): Org[] {
    const dir = this.sortDir === "asc" ? 1 : -1;
    const key = this.sortBy;
    return [...arr].sort((a, b) => {
      const av = (key === "name" ? a.name : a.director).toLowerCase();
      const bv = (key === "name" ? b.name : b.director).toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }

  private paged(arr: Org[]): Org[] {
    const start = (this.page - 1) * this.pageSize;
    return arr.slice(start, start + this.pageSize);
  }

  private toggleSort(col: SortKey) {
    if (this.sortBy === col) {
      this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    } else {
      this.sortBy = col;
      this.sortDir = "asc";
    }
    this.render();
  }

  private render() {
    const filtered = this.filtered();
    const sorted = this.sorted(filtered);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    if (this.page < 1) this.page = 1;
    const pageItems = this.paged(sorted);

    this.$sortDirName.textContent = this.sortBy === "name" ? (this.sortDir === "asc" ? "↑" : "↓") : "";
    this.$sortDirDirector.textContent = this.sortBy === "director" ? (this.sortDir === "asc" ? "↑" : "↓") : "";

    this.$rows.innerHTML =
      pageItems
        .map(
          (o) => `
        <tr data-id="${o.id}">
        <td class="clickable">${this.escape(o.name)}</td>
        <td class="clickable">${this.escape(o.director)}</td>
        <td class="clickable">${this.escape(o.phone)}</td>
        <td class="clickable">г. ${this.escape(o.address.city)}, ул. ${this.escape(o.address.street)}, д. ${this.escape(
            o.address.build
          )}</td>
        <td class="actions"><button class="del" title="Удалить">✕</button></td>
      </tr>
    `
        )
        .join("") || `<tr><td colspan="5" class="muted" style="padding:16px;">Нет данных</td></tr>`;

    this.$pageNum.textContent = `${this.page} из ${totalPages}`;
  }

  private escape(s: string): string {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  private openAdd() {
    this.editId = null;
    this.$modalTitle.textContent = "Добавить организацию";
    this.$fName.value = "";
    this.$fDirector.value = "";
    this.$fPhone.value = "";
    this.$fCity.value = "";
    this.$fStreet.value = "";
    this.$fbuild.value = "";
    this.updateOkDisabled();
    this.$overlay.classList.add("show");
  }

  private openEdit(id: OrgId) {
    const item = this.items.find((x) => x.id === id);
    if (!item) return;
    this.editId = id;
    this.$modalTitle.textContent = `Редактировать организацию ${item.name}`;
    this.$fName.value = item.name;
    this.$fDirector.value = item.director;
    this.$fPhone.value = item.phone;
    this.$fCity.value = item.address.city;
    this.$fStreet.value = item.address.street;
    this.$fbuild.value = item.address.build;
    this.updateOkDisabled();
    this.$overlay.classList.add("show");
  }

  private closeModal() {
    this.$overlay.classList.remove("show");
  }

  private updateOkDisabled() {
    const ok = !!(
      this.$fName.value &&
      this.$fDirector.value &&
      this.$fPhone.value &&
      this.$fCity.value &&
      this.$fStreet.value &&
      this.$fbuild.value
    );
    this.$ok.disabled = !ok;
  }

  private save() {
    const payload: Org = makeOrg({
      id: this.editId ?? undefined,
      name: this.$fName.value.trim(),
      director: this.$fDirector.value.trim(),
      phone: this.$fPhone.value.trim(),
      address: { city: this.$fCity.value.trim(), street: this.$fStreet.value.trim(), build: this.$fbuild.value.trim() },
    });

    if (this.editId) {
      const idx = this.items.findIndex((x) => x.id === this.editId);
      if (idx !== -1) this.items[idx] = payload;
    } else {
      this.items.push(payload);
    }

    this.closeModal();
    this.render();
  }

  private remove(id: OrgId) {
    this.items = this.items.filter((i) => i.id !== id);
    this.render();
  }
}

new DirectoryApp();
