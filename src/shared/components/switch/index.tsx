import React from 'react'
import './switch.css'
interface SwitchInterface {
  toggleDonation:boolean,
  handleChange:any
}

function Swtich(props: SwitchInterface) {
    const {toggleDonation,handleChange} = props

    return (
        <label className="switch">
        <input type="checkbox" checked={toggleDonation} onChange={handleChange} />
        <span className="slider round"></span>
      </label> 
    )
}

export default Swtich
