import { defaultAvatar, EyeIcon } from "assets";
import { useState } from "react";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import DetailsModal from "shared/modal/details";
import { classNames } from "shared/utils/helper";
import tableStyle from "./style.module.scss";
import { Spinner } from "react-bootstrap";
import moment from "moment";
interface Props {
  table_Heading: Array<any>;
  table_data: Array<any>;
  viewAll: number;
  loader: boolean;
}

function DonationTable(props: Props) {
  const { table_Heading, table_data, viewAll, loader } = props;
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const handleDetailsModalOpen = () => {
    setShowDetailsModal(true);
  };
  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
  };
  return (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {table_Heading.map((item: any, inx: number) => {
                return (
                  <th
                    className={classNames(
                      tableStyle.td_padding,
                      tableStyle.t_heading
                    )}
                    key={inx}
                  >
                    <td
                      className={classNames(
                        tableStyle.td_head_item,
                        inx > 2 && inx < table_Heading.length - 1
                          ? "text-center"
                          : inx === table_Heading.length - 1
                          ? "text-end"
                          : ""
                      )}
                    >
                      {item.heading}
                    </td>
                  </th>
                );
              })}
            </tr>
          </thead>
          {loader ? (
            <Loader />
          ) : (
            <tbody>
              {table_data.map((item: any, inx: number) => {
                return inx < viewAll ? (
                  <tr key={inx}>
                    <td className={tableStyle.td_padding}>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            item.avatar
                              ? item.social_login_id
                                ? item.avatar
                                : item.base_url + item.avatar
                              : defaultAvatar
                          }
                          className={tableStyle.image}
                        />
                        <div className={classNames(tableStyle.t_avatar)}>
                          <Heading
                            title={item.name}
                            headingStyle={tableStyle.t_userName}
                          />
                          <Title
                            title={"@" + item.user_name}
                            titleStyle={tableStyle.t_avatar_title}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      className={classNames(
                        tableStyle.gray,
                        tableStyle.td_padding
                      )}
                    >
                      ${item.amount}
                    </td>
                    <td
                      className={classNames(
                        tableStyle.gray,
                        tableStyle.td_padding
                      )}
                    >
                      {moment
                        .utc(item?.billing_date)
                        .local()
                        .format("MMM Do YYYY")}
                    </td>

                    <td
                      className={classNames(
                        tableStyle.gray,
                        tableStyle.td_padding,
                        tableStyle.item_padding_left
                      )}
                    >
                      {item.status}
                    </td>
                    <td
                      className={classNames(
                        tableStyle.gray,
                        tableStyle.action_padding,
                        "text-end"
                      )}
                    >
                      <CustomButton
                        iconStyle={tableStyle.icon}
                        containerStyle={tableStyle.icon_view}
                        Icon={EyeIcon}
                        submitHandle={() => {
                          setSelectedItem(item);
                          handleDetailsModalOpen();
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  ""
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      <DetailsModal
        title="Donation History"
        isTransaction={false}
        isDonation={true}
        show={showDetailsModal}
        handleClose={handleDetailsModalClose}
        item={selectedItem}
      />
    </>
  );
}
const Loader = () => {
  return (
    <tr className={tableStyle.loaderContainer}>
      <td className="text-center" colSpan={6}>
        <div>
          {" "}
          <Spinner animation="border" style={{ color: "primary" }} />
        </div>
      </td>
    </tr>
  );
};

export default DonationTable;
