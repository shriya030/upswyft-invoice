import React, { useState, useEffect, useRef } from "react";
import { initialProductLine } from "../data/initialData";
import EditableInput from "./EditableInput";
import EditableSelect from "./EditableSelect";
import EditableTextarea from "./EditableTextarea";
import EditableCalendarInput from "./EditableCalendarInput";
import countryList from "../data/countryList";
import defaultImage from "../images/download.png";
import Text from "./Text";
import format from "date-fns/format";
import "@progress/kendo-theme-material/dist/all.css";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport } from "@progress/kendo-react-pdf";

function InvoicePage() {
  let initialdata = {
    title: "INVOICE",
    companyName: "",
    name: "",
    companyAddress: "",
    companyAddress2: "",
    companyCountry: "India",
    clientName: "",
    clientAddress: "",
    clientAddress2: "",
    clientCountry: "India",
    shippingName: "",
    shippingAddress: "",
    shippingAddress2: "",
    shippingCountry: "India",
    invoiceTitle: "",
    invoiceDate: "",
    invoiceDueDate: "",
    productLines: [{ ...initialProductLine }],
    taxLabel: "Sale Tax (10%)",
    currency: "Rs.",
    notes: "It was great doing business with you.",
    term: "Please make the payment by the due date.",
    pdfMode: false
  };

  const [invoice, setInvoice] = useState(initialdata);
  const [subTotal, setSubTotal] = useState(0);
  const [saleTax, setSaleTax] = useState(0);
  const [file, setFile] = useState({ file: null });

  useEffect(() => {
    let subTotal = 0;

    invoice.productLines.forEach(productLine => {
      const quantityNumber = parseFloat(productLine.quantity);
      const rateNumber = parseFloat(productLine.rate);
      const amount =
        quantityNumber && rateNumber ? quantityNumber * rateNumber : 0;

      subTotal += amount;
    });

    setSubTotal(subTotal);
  }, [invoice.productLines]);

  useEffect(() => {
    const match = invoice.taxLabel.match(/(\d+)%/);
    const taxRate = match ? parseFloat(match[1]) : 0;
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0;

    setSaleTax(saleTax);
  }, [subTotal, invoice.taxLabel]);

  const pdfExportComponent = useRef(null);
  const dateFormat = "MM-dd-yyyy";
  const invoiceDate =
    invoice.invoiceDate !== "" ? new Date(invoice.invoiceDate) : new Date();
  const invoiceDueDate =
    invoice.invoiceDueDate !== ""
      ? new Date(invoice.invoiceDueDate)
      : new Date(invoiceDate.valueOf());

  if (invoice.invoiceDueDate === "") {
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30);
  }

  const handleChange = (name, value) => {
    if (name !== "productLines") {
      const newInvoice = { ...invoice };
      newInvoice[name] = value;

      setInvoice(newInvoice);
    }
  };

  const handleProductLineChange = (index, name, value) => {
    const productLines = invoice.productLines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = { ...productLine };

        if (name === "description") {
          newProductLine[name] = value;
        } else {
          if (
            value[value.length - 1] === "." ||
            (value[value.length - 1] === "0" && value.includes("."))
          ) {
            newProductLine[name] = value;
          } else {
            const n = parseFloat(value);

            newProductLine[name] = (n ? n : 0).toString();
          }
        }

        return newProductLine;
      }

      return { ...productLine };
    });

    setInvoice({ ...invoice, productLines });
  };

  const handleRemove = i => {
    const productLines = invoice.productLines.filter(
      (productLine, index) => index !== i
    );

    setInvoice({ ...invoice, productLines });
  };

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }];

    setInvoice({ ...invoice, productLines });
  };

  const calculateAmount = (quantity, rate) => {
    const quantityNumber = parseFloat(quantity);
    const rateNumber = parseFloat(rate);
    const amount =
      quantityNumber && rateNumber ? quantityNumber * rateNumber : 0;

    return amount.toFixed(2);
  };

  const handleExportWithComponent = event => {
    pdfExportComponent.current.save();
  };

  const fileSelectedHandler = event => {
    if (event.target.files.length !== 0) {
      setFile({ file: URL.createObjectURL(event.target.files[0]) });
    } else {
      setFile({ file: null });
    }
  };

  return (
    <div>
      <PDFExport ref={pdfExportComponent} paperSize="Letter">
        <div className="invoice-wrapper">
          <h1 style={{ textAlign: "center", fontSize: "2.5rem" }}>
            Purchase Order
          </h1>
          <div className="flex" pdfMode={invoice.pdfMode}>
            <div className="w-50" pdfMode={invoice.pdfMode}>
              <EditableInput
                className="fs-20 bold"
                placeholder="Your Company"
                value={invoice.companyName}
                onChange={value => handleChange("companyName", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="Your Name"
                value={invoice.name}
                onChange={value => handleChange("name", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="Company's Address"
                value={invoice.companyAddress}
                onChange={value => handleChange("companyAddress", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="City, State Zip"
                value={invoice.companyAddress2}
                onChange={value => handleChange("companyAddress2", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableSelect
                options={countryList}
                value={invoice.companyCountry}
                onChange={value => handleChange("companyCountry", value)}
                pdfMode={invoice.pdfMode}
              />
            </div>
            <div className="w-50" pdfMode={invoice.pdfMode}>
              <input
                className="right bold span"
                type="file"
                value=""
                onChange={fileSelectedHandler}
              />
              <img
                style={{ height: "30vh", width: "30vh" }}
                src={file.file ? file.file : defaultImage}
                defaultValue=""
              />
            </div>
          </div>

          <div className="flex mt-40" pdfMode={invoice.pdfMode}>
            <div className="w-55" pdfMode={invoice.pdfMode}>
              <div className="bold dark mb-5">Bill To:</div>
              <EditableInput
                placeholder="Your Client's Name"
                value={invoice.clientName}
                onChange={value => handleChange("clientName", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="Client's Address"
                value={invoice.clientAddress}
                onChange={value => handleChange("clientAddress", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="City, State Zip"
                value={invoice.clientAddress2}
                onChange={value => handleChange("clientAddress2", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableSelect
                options={countryList}
                value={invoice.clientCountry}
                onChange={value => handleChange("clientCountry", value)}
                pdfMode={invoice.pdfMode}
              />
              <br />
              <br />
              <div className="bold dark mb-5">Ship To:</div>
              <EditableInput
                placeholder="Your Client's Name"
                value={invoice.shippingName}
                onChange={value => handleChange("shippingName", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="Shipping Address"
                value={invoice.shippingAddress}
                onChange={value => handleChange("shippingtAddress", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableInput
                placeholder="City, State, Zip Code"
                value={invoice.shippingAddress2}
                onChange={value => handleChange("shippingAddress2", value)}
                pdfMode={invoice.pdfMode}
              />
              <EditableSelect
                options={countryList}
                value={invoice.shippingCountry}
                onChange={value => handleChange("shippingCountry", value)}
                pdfMode={invoice.pdfMode}
              />
            </div>
            <div className="w-45" pdfMode={invoice.pdfMode}>
              <div className="flex mb-5" pdfMode={invoice.pdfMode}>
                <div className="w-40" pdfMode={invoice.pdfMode}>
                  <div className="bold">Invoice#</div>
                </div>
                <div className="w-60" pdfMode={invoice.pdfMode}>
                  <EditableInput
                    placeholder="INV"
                    value={invoice.invoiceTitle}
                    onChange={value => handleChange("invoiceTitle", value)}
                    pdfMode={invoice.pdfMode}
                  />
                </div>
              </div>
              <div className="flex mb-5" pdfMode={invoice.pdfMode}>
                <div className="w-40" pdfMode={invoice.pdfMode}>
                  <div className="bold">Invoice Date: </div>
                </div>
                <div className="w-60" pdfMode={invoice.pdfMode}>
                  <EditableCalendarInput
                    value={format(invoiceDate, dateFormat)}
                    selected={invoiceDate}
                    onChange={date =>
                      handleChange(
                        "invoiceDate",
                        date && !Array.isArray(date)
                          ? format(date, dateFormat)
                          : ""
                      )
                    }
                    pdfMode={invoice.pdfMode}
                  />
                </div>
              </div>
              <div className="flex mb-5" pdfMode={invoice.pdfMode}>
                <div className="w-40" pdfMode={invoice.pdfMode}>
                  <div className="bold">Due Date: </div>
                </div>
                <div className="w-60" pdfMode={invoice.pdfMode}>
                  <EditableCalendarInput
                    value={format(invoiceDueDate, dateFormat)}
                    selected={invoiceDueDate}
                    onChange={date =>
                      handleChange(
                        "invoiceDueDate",
                        date && !Array.isArray(date)
                          ? format(date, dateFormat)
                          : ""
                      )
                    }
                    pdfMode={invoice.pdfMode}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-30 bg-dark flex" pdfMode={invoice.pdfMode}>
            <div className="w-48 p-4-8" pdfMode={invoice.pdfMode}>
              <div className="white bold">Item Description </div>
            </div>
            <div className="w-17 p-4-8" pdfMode={invoice.pdfMode}>
              <div className="white bold right">Qty</div>
            </div>
            <div className="w-17 p-4-8" pdfMode={invoice.pdfMode}>
              <div className="white bold right">Rate</div>
            </div>
            <div className="w-18 p-4-8" pdfMode={invoice.pdfMode}>
              <div className="white bold right">Amount</div>
            </div>
          </div>

          {invoice.productLines.map((productLine, i) => {
            return invoice.pdfMode && productLine.description === "" ? (
              <Text key={i}></Text>
            ) : (
              <div key={i} className="row flex" pdfMode={invoice.pdfMode}>
                <div className="w-48 p-4-8 pb-10" pdfMode={invoice.pdfMode}>
                  <EditableTextarea
                    className="dark"
                    rows={2}
                    placeholder="Enter item Name/Description"
                    value={productLine.description}
                    onChange={value =>
                      handleProductLineChange(i, "description", value)
                    }
                    pdfMode={invoice.pdfMode}
                  />
                </div>
                <div className="w-17 p-4-8 pb-10" pdfMode={invoice.pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.quantity}
                    onChange={value =>
                      handleProductLineChange(i, "quantity", value)
                    }
                    pdfMode={invoice.pdfMode}
                  />
                </div>
                <div className="w-17 p-4-8 pb-10" pdfMode={invoice.pdfMode}>
                  <EditableInput
                    className="dark right"
                    value={productLine.rate}
                    onChange={value =>
                      handleProductLineChange(i, "rate", value)
                    }
                    pdfMode={invoice.pdfMode}
                  />
                </div>
                <div className="w-18 p-4-8 pb-10" pdfMode={invoice.pdfMode}>
                  <Text className="dark right" pdfMode={invoice.pdfMode}>
                    {calculateAmount(productLine.quantity, productLine.rate)}
                  </Text>
                </div>
                {!invoice.pdfMode && (
                  <button
                    className="link row__remove"
                    aria-label="Remove Row"
                    title="Remove Row"
                    onClick={() => handleRemove(i)}
                  >
                    <span className="icon icon-remove bg-red"></span>
                  </button>
                )}
              </div>
            );
          })}

          <div className="flex" pdfMode={invoice.pdfMode}>
            <div className="w-50 mt-10" pdfMode={invoice.pdfMode}>
              {!invoice.pdfMode && (
                <button className="link" onClick={handleAdd}>
                  <span className="icon icon-add bg-green mr-10"></span>
                  Add Line Item
                </button>
              )}
            </div>
            <div className="w-50 mt-20" pdfMode={invoice.pdfMode}>
              <div className="flex" pdfMode={invoice.pdfMode}>
                <div className="w-50 p-5" pdfMode={invoice.pdfMode}>
                  <div>SubTotal </div>
                </div>
                <div className="w-50 p-5" pdfMode={invoice.pdfMode}>
                  <Text className="right bold dark" pdfMode={invoice.pdfMode}>
                    {subTotal?.toFixed(2)}
                  </Text>
                </div>
              </div>
              <div className="flex" pdfMode={invoice.pdfMode}>
                <div className="w-50 p-5" pdfMode={invoice.pdfMode}>
                  <div>Sale Tax (10%)</div>
                </div>
                <div className="w-50 p-5" pdfMode={invoice.pdfMode}>
                  <Text className="right bold dark" pdfMode={invoice.pdfMode}>
                    {saleTax?.toFixed(2)}
                  </Text>
                </div>
              </div>
              <div className="flex bg-gray p-5" pdfMode={invoice.pdfMode}>
                <div className="w-50 p-5" pdfMode={invoice.pdfMode}>
                  <div className="bold">Total</div>
                </div>
                <div className="w-50 p-5 flex" pdfMode={invoice.pdfMode}>
                  <EditableInput
                    className="dark bold right ml-30"
                    value={invoice.currency}
                    onChange={value => handleChange("currency", value)}
                    pdfMode={invoice.pdfMode}
                  />
                  <Text
                    className="right bold dark w-auto"
                    pdfMode={invoice.pdfMode}
                  >
                    {(typeof subTotal !== "undefined" &&
                    typeof saleTax !== "undefined"
                      ? subTotal + saleTax
                      : 0
                    ).toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20" pdfMode={invoice.pdfMode}>
            <div className="bold w-100">Notes</div>
            <EditableTextarea
              className="w-100"
              rows={2}
              value={invoice.notes}
              onChange={value => handleChange("notes", value)}
              pdfMode={invoice.pdfMode}
            />
          </div>
          <div className="mt-20" pdfMode={invoice.pdfMode}>
            <div className="bold w-100">Terms and Conditions</div>

            <EditableTextarea
              className="w-100"
              rows={2}
              value={invoice.term}
              onChange={value => handleChange("term", value)}
              pdfMode={invoice.pdfMode}
            />
          </div>
        </div>
      </PDFExport>
      <div className="btn">
        <Button primary={true} onClick={handleExportWithComponent}>
          Download
        </Button>
      </div>
    </div>
  );
}

export default InvoicePage;
