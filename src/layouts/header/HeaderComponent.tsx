import "./HeaderComponent.scss";
import Breadcrumb from "./breadcrumb/Breadcrumb";
import {IMAGE_URI} from "../../contants";

function HeaderComponent() {

    return (
        <div className="app-header">
            <Breadcrumb/>
            <img className="logo" alt="bosch-logo" src={`${IMAGE_URI}/bosch-logo.svg`}/>
        </div>
    )
}

export default HeaderComponent;
