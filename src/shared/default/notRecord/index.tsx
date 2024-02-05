import React from 'react'
import {  NoContentSearch } from "assets";
import { classNames } from "shared/utils/helper";
import styles from './style.module.scss'
interface Props {}

function NotRecord(props: Props) {
    const {} = props

    return (
        <div
            className={classNames(
              "d-flex flex-column justify-content-center  align-items-center w-100",styles.mainContainer

            )}
          >
            <NoContentSearch className={styles.notFound} />
            <label className={classNames(styles.noContentText,"ms-4")}>
              Oops! No record yet.
            </label>
          </div>
    )
}

export default NotRecord
