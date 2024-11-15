import { useForm } from "react-hook-form";

export const ItemDetails = () => {
  return (
    <div id="item-details-flex">
    <form>
    <div id="form-item">
      <label className="form-label" htmlFor="Date">Reminder Date</label>
      <input id="Date" className="form-control" type="date"></input>
    </div>
    <div id="form-item">
      <label className="form-label" htmlFor="Reminder">Reminder</label>
      <input id="Reminder" className="form-control" type="text"></input>
    </div>
    <div id="form-item">
      <label className="form-label" >Recurs</label>
      <input id="Number" className="form-control" type="number"></input>
      <select id="unit_time" className="form-control">
        <option>Weeks</option>
        <option>Months</option>
        <option>Years</option>
      </select>
    </div>
    </form>
    </div>)
}
