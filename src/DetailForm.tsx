import { Form, Formik, FormikValues } from "formik";
import { coordinateTypes } from "./Map";
import { Button, Checkbox } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function DetailForm({
  item,
  coordinates,
  setCoordinates,
  closeModal,
}: {
  item: coordinateTypes | null;
  coordinates: coordinateTypes[];
  setCoordinates: (coordinates: coordinateTypes[]) => void;
  closeModal: () => void;
}) {
  const handleFormSubmit = (values: FormikValues) => {
    if (item !== null) {
      const updatedCoordinates = coordinates.map((coord) =>
        coord.id === item.id
          ? { ...coord, status: values.status, details: values.details }
          : coord
      );
      setCoordinates(updatedCoordinates);
      localStorage.setItem("coordinates", JSON.stringify(updatedCoordinates));
      closeModal();
    }
  };

  const initialValues = {
    status: item?.status ?? false,
    details: item?.details ?? "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Checkbox
            name="status"
            checked={values.status}
            onChange={() => setFieldValue("status", !values.status)}
          >
            Status
          </Checkbox>
          <div className="mb-3">
            <label htmlFor="details" className="form-label text-lg">
              Comment
            </label>
            <TextArea
              name="details"
              value={values.details}
              onChange={(e) => setFieldValue("details", e.target.value)}
              placeholder="Enter comment"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>

          <Button type="primary" htmlType="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
