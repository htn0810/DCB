import "./HomeComponent.scss"
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Typography} from "@mui/material";
import {hideSidebar} from '../../app/sidebar.slice';
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {useAppDispatch, useAppSelector} from '../../custom-hooks/hook';
// API
import {PublicApi} from "../../api/public.api";
// Components
import SelectOrgComponent from './select-org/SelectOrgComponent';

const CONTACT_EMAILS = 'Huy.NguyenAnh@vn.bosch.com; ' +
    'Nguyen.NguyenHongSy@vn.bosch.com; ' +
    'Tri.HoangPhamMinh@vn.bosch.com; ' +
    'Bao.NguyenThe@vn.bosch.com; ' +
    'fixed-term.Nhan.HuynhThanh@vn.bosch.com'

const HomeComponent = () => {
    const [totalOrganizations, setTotalOrganizations] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);

    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hideSidebar());
        dispatch(showIndicator())
        PublicApi.getStatistics().then(res => {
            if (res) {
                setTotalOrganizations(res.numberOrganizations);
                setTotalAssets(res.numberAssets);
                setTotalEmployees(res.numberEmployees);
            }
            dispatch(hideIndicator());
        }).catch(() => {
            dispatch(hideIndicator());
        })
    }, [])

    return (
        <section className="home-container">
            <section className="home-banner">
                <div className="black-background" />
                <div className="info-wrapper">
                    <div className="home-greeting">
                        <Typography variant="h2">
                            Welcome to Digital Core,
                        </Typography>
                        <Typography variant="h2">
                            {account?.familyName + " " + account?.givenName}
                        </Typography>
                    </div>

                    <SelectOrgComponent />

                    <Typography variant="subtitle2" className="home-contact">
                        Want to create new organization?
                        <Link className="mail" to={"mailto:" + CONTACT_EMAILS + "?subject=Support required for Digital Core"}>
                            Contact us!
                        </Link>
                    </Typography>
                </div>
            </section>
            <section className="home-details">
                <CircleInfo type="organizations" total={totalOrganizations} title="Organizations"/>
                <CircleInfo type="assets" total={totalAssets} title="Assets"/>
                <CircleInfo type="employees" total={totalEmployees} title="Employees"/>
            </section>
        </section>
    );
};

const CircleInfo = (props: { type: string, total: number, title: string }) => {
    return (
        <div className={`home-details_number ${props.type}`}>
            <h3>{props.total}</h3>
            <span>{props.title}</span>
        </div>
    );
}

export default HomeComponent;
