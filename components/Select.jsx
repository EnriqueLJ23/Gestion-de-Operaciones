'use client'

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo({data}) {
  const [selectedValue, setSelectedValue] = React.useState(null)
  const selectedItem = data.find(item => item.value.toString() === selectedValue)

  return (
    <Select onValueChange={(value) => {
      // Update the state with the new selected value
      const newValue = value === selectedValue ? null : value
      setSelectedValue(newValue)
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccione:"  value={selectedItem?.label || ""}/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        {data.map(item => (
            <SelectItem key={item.value} value={item.value.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
