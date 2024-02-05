import { CloseIcon, EditPencil, EyeIcon, defaultAvatar } from "assets";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import CustomButton from "shared/components/customButton";
import Heading from "shared/components/heading";
import Title from "shared/components/title";
import { classNames } from "shared/utils/helper";
import tableStyle from "./style.module.scss";
interface Props {
  table_Heading: Array<any>;
  table_data: Array<any>;
  viewAll: number;
  loader: boolean;
  actionButton?: any;
}

function SubscriptionTable(props: Props) {
  const navigate = useNavigate();
  const { table_Heading, table_data, viewAll, loader, actionButton } = props;

  return (
    <div className="table-responsive pb-3">
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
                  <td className={tableStyle.td_head_item}>{item.heading}</td>
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
                    <div
                      className="d-flex align-items-center pointer"
                      onClick={() => navigate("/profile/" + item?.user_id)}
                    >
                      <img
                        src={
                          item?.avatar
                            ? item?.social_login_id
                              ? item?.avatar
                              : item?.base_url + item?.avatar
                            : defaultAvatar
                        }
                        className={tableStyle.image}
                        alt="user-img"
                      />
                      <div className={classNames(tableStyle.t_avatar)}>
                        <Heading
                          title={item?.name}
                          headingStyle={tableStyle.t_userName}
                        />
                        <Title
                          title={"@" + item?.user_name}
                          titleStyle={tableStyle.t_avatar_title}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={classNames(tableStyle.td_padding)}>
                    <label className={classNames(tableStyle.gray)}>
                      ${item?.amount}
                    </label>
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
                      .format("MMM DD,YYYY")}
                  </td>
                  <td
                    className={classNames(
                      tableStyle.gray,
                      tableStyle.td_padding,
                      !item?.package_type
                        ? tableStyle.item_padding_left_emty
                        : ""
                    )}
                  >
                    {item?.package_type ? item?.package_type : "N/A"}
                  </td>
                  <td
                    className={classNames(
                      tableStyle.gray,
                      tableStyle.td_padding
                    )}
                  >
                    {item.status}
                  </td>
                  <td
                    className={classNames(
                      tableStyle.gray,
                      tableStyle.action_padding
                    )}
                  >
                    <CustomButton
                      iconStyle={tableStyle.icon}
                      containerStyle={tableStyle.icon_view}
                      Icon={EyeIcon}
                      submitHandle={() => {
                        let obj = { item, type: "view" };
                        actionButton(obj);
                      }}
                    />

                    {!item?.cancelled_at ? (
                      <>
                        <CustomButton
                          containerStyle={tableStyle.icon_edit_button}
                          Icon={EditPencil}
                          submitHandle={() => {
                            let obj = { item, type: "edit" };
                            actionButton(obj);
                          }}
                        />
                        <CustomButton
                          iconStyle={tableStyle.closeIcon}
                          containerStyle={tableStyle.icon_close}
                          Icon={CloseIcon}
                          submitHandle={() => {
                            let obj = { item, type: "cancel" };
                            actionButton(obj);
                          }}
                        />
                      </>
                    ) : (
                      ""
                    )}
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

export default SubscriptionTable;
