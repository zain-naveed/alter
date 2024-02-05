import React from 'react'
import { classNames } from "shared/utils/helper";
import styles from './style.module.scss'
import { routeConstant} from 'shared/routes/routeConstant'
import { useNavigate } from "react-router";
interface Props {}

function PrivacyFooter(props: Props) {
    const {} = props
    const navigate = useNavigate();

    return (
        <>
        <div className={styles.footer_container}>
            <div className={classNames('container d-flex justify-content-between',styles.foot_sub_container)}>
                <span className={classNames(styles.font_color)}>© Copyright 2023, All Rights Reserved</span>
                <div className={classNames("d-flex justify-content-between",styles.privacy_container)}>
                    <span className={classNames(styles.font_color,styles.cursor)}  onClick={()=>{
                        navigate(routeConstant.privacy.path)
                    }}>Privacy Policy</span>
                    <span className={classNames(styles.font_color,styles.cursor)} onClick={()=>{
                        navigate(routeConstant.terms.path)
                    }}>Terms & Conditions</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default PrivacyFooter
