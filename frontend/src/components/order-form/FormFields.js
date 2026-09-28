import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const fieldClass = "border-orange-200 focus:border-orange-400";
const keyFor = (name) => name.replaceAll("_", "-");

export const FormTextField = ({ name, label, form, multiline = false, onChange, className = fieldClass, ...props }) => {
  const Control = multiline ? Textarea : Input;
  const prefix = multiline ? "textarea" : "input";
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Control id={name} name={name} value={form.formData[name]} onChange={onChange || form.handleInputChange}
        data-testid={`${prefix}-${keyFor(name)}`} className={className} {...props} />
    </div>
  );
};

export const FormSelectField = ({ name, label, form, options, placeholder, disabled, onChange }) => {
  const testKey = keyFor(name);
  const menuId = name === "payment_type" ? "payment-type-options" : `${testKey}-options`;
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Select value={form.formData[name]} onValueChange={onChange || ((value) => form.handleSelectChange(name, value))} disabled={disabled}>
        <SelectTrigger id={name} data-testid={`select-${testKey}`} className="border-orange-200">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent data-testid={menuId}>
          {options.map((option, index) => <SelectItem key={option} value={option} data-testid={`${testKey}-option-${index}`}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
};

export const FormCheckbox = ({ name, label, form, testId, labelClassName = "cursor-pointer", className = "flex items-center space-x-2" }) => (
  <div className={className}>
    <Checkbox id={name} checked={form.formData[name]} onCheckedChange={(checked) => form.setField(name, checked === true)} data-testid={testId || `checkbox-${keyFor(name)}`} />
    <Label htmlFor={name} className={labelClassName}>{label}</Label>
  </div>
);

export const SectionHeading = ({ icon: Icon, children, testId, className = "flex items-center gap-2 text-orange-600 font-semibold" }) => (
  <div className={className}><Icon className="w-5 h-5" /><h3 data-testid={testId}>{children}</h3></div>
);