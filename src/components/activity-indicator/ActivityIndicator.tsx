import "./ActivityIndicator.scss";
import {useEffect} from "react";
import {useAppSelector} from "../../custom-hooks/hook";

function ActivityIndicator() {
    const loading = useAppSelector(state => state.app.loading);

    useEffect(() => {
        document.body.style.overflow = loading ? 'hidden' : 'unset';
    }, [loading])

    return (
        loading ? (
            <div className="indicator-container">
                <div className="loader">
                    <div className="down-left"></div>
                    <div className="up-right"></div>
                </div>
            </div>
        ) : null
    )
}

export default ActivityIndicator;
