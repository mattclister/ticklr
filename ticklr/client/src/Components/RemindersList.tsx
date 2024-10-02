import reminderdata from './reminderdata.json' 
console.log(reminderdata)

const formatedDate = (utcDateTime: string)=> {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const [datePart] = utcDateTime.split('T');
  const [year, month, day] = datePart.split('-');
  const monthTxt = months[parseInt(month)-1]
  return {day, month, year, monthTxt}
}

const formatedArray = reminderdata.map((item)=> ({...item, formatedDate: formatedDate(item.date)}))
console.log(formatedArray)

export const RemindersList = () => {
  return (
    <>
    <ul id="remindersList" className="list-group">
      {formatedArray.map((item)=>
      <li className="list-group-item" key={item.id}>
      <div className="row align-items-start">
      <div className="col">
        <h6>{item.formatedDate.day} {item.formatedDate.monthTxt}</h6>
      </div>
      <div className="col">
        {item.title}
        </div>
        <div className="col">
      {item.recurs}</div>
      </div>
      </li>
      )}
      <li className="list-group-item"> <button id="add-new-item-btn" className="btn btn-outline-secondary">+ add new item</button></li>
    </ul>
    </>
  )
}
