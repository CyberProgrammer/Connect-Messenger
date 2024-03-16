import React from "react"

import CheckMark from './../../assets/check.svg'
import './FilterMenu.css'

interface FilterMenuProps {
    sortOrder: string
    setSortOrder: React.Dispatch<React.SetStateAction<string>>
}

const FilterMenu : React.FC<FilterMenuProps> = ({sortOrder, setSortOrder}) =>{
    // Function to handle sort by option click
    const handleSortOrderClick = (option: string) => {
        setSortOrder(option)
        console.log("Order by:", sortOrder)
    }

    return(
        <div className={"filter-menu"}>
            <div className={"sort-order"}>
                <div className={"title"}>
                    <p>Sort order</p>
                </div>
                <div className={"option"}>
                    <button onClick={() => handleSortOrderClick("Newest")}>
                        <img src={CheckMark} alt={"check"} className={`check ${sortOrder === "Newest" ? "show-check" : "hide-check"}`}/>
                        <h3>Newest on top</h3>
                    </button>
                </div>
                <div className={"option"}>
                    <button onClick={() => handleSortOrderClick("Oldest")}>
                        <img src={CheckMark} alt={"check"} className={`check ${sortOrder === "Oldest" ? "show-check" : "hide-check"}`}/>
                        <h3>Oldest on top</h3>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FilterMenu