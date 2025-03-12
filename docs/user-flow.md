## User flow

### Inserting data into sheet (Existing or New)

1. Select voice or image
2. Input patient ID and visit type (i.e First visit, 2 weeks, operation, etc)
3. Voice: Say patient data.

Examples:

```
50kg, 170 cm. QOL 3, and 2 weeks of VLCD.
Operation date on 1st Jan 2025, by Dr. Jason. No complications.
HBP, Diabetes, cholestrol problems, all no.
HBA1C 3.
No Diabetes medications.
```

```
Weight is now 60kg. New BMI: 24.
```

4. FE Posts to /excel/validate
5. Response is key/value pairs of field and data mapped
6. User checks/edits fields
7. FE Posts to /excel/generate with corrected fields
8. Workbook generated
9. FE downloads Workbook
