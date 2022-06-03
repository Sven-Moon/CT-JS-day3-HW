class F1Table {
  constructor(id) {
    this.node = document.getElementById(id)
    this.createForm = this.createForm.bind(this)
    this.createTable = this.createTable.bind(this)

    this.store = {}
    this.errors = []

    this.form = this.createForm()
    this.table = this.createTable()
    this.node.append(this.form)
    this.node.append(this.table)
    this.populateRows()
  }

  async getData(year = 2018, round = 3) {
    if (!this.store[year]) this.store[year] = {}
    if (!this.store[year][round]) {
      const response = await axios.get(`https://ergast.com/api/f1/${year}/${round}/driverStandings.json`)
      if (response.status === 200)
        this.store[year][round] = response.data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings'];
      else this.errors.push(response.err)
    }
  }

  createForm() {
    const form = document.createElement('form')
    form.className = 'f1-form'
    form.setAttribute("id", "f1-form")
    const yearField = document.createElement('div')
    yearField.className = "form-group"
    yearField.innerHTML = `<label for="year">Year</label>
      <input id="input_year" type="number" name="year" value="2018" required minlength="4" maxlength="4" min="2015" max="2022"
        onchange="ft.populateRows()">`
    const roundField = document.createElement('div')
    yearField.className = "form-group"
    roundField.innerHTML = `<div class="form-group">
      <label for="round">Round</label>
      <input id="input_round" type="number" name="round" value="3" required minlength="1" min="1"
        onchange="ft.populateRows()">
    </div>`
    form.appendChild(yearField)
    form.appendChild(roundField)
    return form
  }
  createTable() {
    const table = document.createElement('table')
    table.className = "f1-table"
    table.innerHTML = `<tr>
      <th>Position</th>
      <th>Name</th>
      <th>Nationality</th>
      <th>Sponsor</th>
      <th>Points</th>
    </tr>`
    return table
  }


  async populateRows() {
    document.querySelectorAll(".driverRowData")
      .forEach(row => row.remove())
    let year = document.getElementById("input_year").value
    let round = document.getElementById("input_round").value
    await this.getData(year, round)
      .then(() => {
        this.removeError_box()
        // let start = 0
        // let i = 0
        // while (i < start + 7 && i < drivers.length) {
        //   let driver = data['Driver']
        //   let driverName = `${driver.familyName} ${driver.givenName}`
        //   let sponsor = data.Constructors[0].name
        //   const tableRow = document.createElement('tr')
        //   tableRow.className = "driverRowData"
        //   tableRow.innerHTML = `
        //     <td>${data.position}</td>
        //     <td>${driverName}</td>
        //     <td>${driver.nationality}</td>
        //     <td>${sponsor}</td>
        //     <td>${data.points}</td>
        //   `
        //   this.table.appendChild(tableRow)
        // }
        let drivers = this.store[year][round]
        drivers.forEach(data => {
          let driver = data.Driver
          let driverName = `${driver.familyName} ${driver.givenName}`
          let sponsor = data.Constructors[0].name
          const tableRow = document.createElement('tr')
          tableRow.className = "driverRowData"
          tableRow.innerHTML = `
            <td>${data.position}</td>
            <td>${driverName}</td>
            <td>${driver.nationality}</td>
            <td>${sponsor}</td>
            <td>${data.points}</td>
          `
          this.table.appendChild(tableRow)
        })
      })
      .catch((err) => {
        this.removeError_box()
        const error_box = document.createElement("div")
        error_box.className = "error_box"
        error_box.innerText = "Could not get more data. See console for details. You probably reached the end of the data."
        console.log(err);
        document.querySelector('.f1-table').insertAdjacentElement("afterend", error_box)
      })
  }
  removeError_box() {
    let e = document.querySelector('.error_box')
    if (e) e.remove()
  }
}

const ft = new F1Table("f1-table")