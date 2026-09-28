import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { STATUS_OPTIONS } from "../../lib/orderColumns";

const FilterSelect = ({ label, placeholder, value, onChange, options, testId }) => (
  <div>
    <Label htmlFor={testId} className="text-xs text-gray-600">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={testId} className="border-orange-200" data-testid={testId}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent data-testid={`${testId}-options`}>
        <SelectItem value="all" data-testid={`${testId}-all`}>{placeholder}</SelectItem>
        {options.map((option, index) => <SelectItem key={option} value={option} data-testid={`${testId}-option-${index}`}>{option}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export const FilterControls = ({ filters }) => (
  <div className="space-y-4 mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input placeholder="Ad, telefon veya sipariş no ile ara..." aria-label="Sipariş ara" value={filters.searchTerm}
        onChange={(event) => filters.setSearchTerm(event.target.value)} className="pl-10 border-orange-200 focus:border-orange-400" data-testid="search-input" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FilterSelect label="İl Filtrele" placeholder="Tüm İller" value={filters.filterProvince} onChange={filters.setFilterProvince} options={filters.provinces} testId="filter-province" />
      <FilterSelect label="Ödeme Filtrele" placeholder="Tüm Ödemeler" value={filters.filterPayment} onChange={filters.setFilterPayment} options={filters.paymentTypes} testId="filter-payment" />
      <FilterSelect label="Durum Filtrele" placeholder="Tüm Durumlar" value={filters.filterStatus} onChange={filters.setFilterStatus} options={STATUS_OPTIONS} testId="filter-status" />
    </div>
  </div>
);