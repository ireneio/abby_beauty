import React from "react";
import AdminReservation from "../templates/AdminReservation";

export function preview() {
  return (
    <AdminReservation
        message={{
            name: 'name',
            phone: '0900123456',
            email: 'test@example.com',
            date: '2024-01-01',
            line_id: 'line_id',
            time_of_day: '下午 (12:00-17:00)',
        }}
    />
  )
}
