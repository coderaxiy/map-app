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

  const saveCoordinatesToLocalStorage = (coords: coordinateTypes[]) => {
    localStorage.setItem("coordinates", JSON.stringify(coords));
  };
console.log("Item in DetailForm:", item);

  

  const handleFormSubmit = (values: FormikValues) => {
    const updatedCoordinates = coordinates.map((coord) =>
      coord.id === item?.id
        ? { ...coord, status: values.status, details: values.details }
        : coord
    );
    setCoordinates(updatedCoordinates);
    saveCoordinatesToLocalStorage(updatedCoordinates);
    closeModal();
  };
  

  const initialValues = {
    status: item?.status || false,
    details: item?.details || "",
  };
  

  return (
    <Formik
      enableReinitialize
      initialValues={{...initialValues, ...item}}
      onSubmit={handleFormSubmit}
    >
      {({ values, setFieldValue }) => (
    <Form onClick={(e:React.MouseEvent) => e.stopPropagation()} >
       <Checkbox
  name="status"
  checked={values.status}
  onChange={(e) => setFieldValue("status", e.target.checked)}
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
