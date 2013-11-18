__author__ = 'Carl-Erik Kopseng'

def filter_readings(values, hoursBetweenReadings):
    current_dt = parse(values[0]['created_at'])
    filtered_values = [values[0]]
    for val in values[1:]:
        dt = parse(val['created_at'])

        if current_dt + relativedelta(hours=hoursBetweenReadings) < dt:
            filtered_values.append(val)
            current_dt = dt

    return filtered_values

def excel_datetime_string(dt):
    return dt.strftime('%Y-%m-%dT%H:%M')


def write_csv(field_id, sensor_readings):
    with open(field_id + '.csv', 'w') as f:
        csv_writer = csv.writer(f, delimiter=';')
        csv_writer.writerow(['TID', 'SENSOR:' + field_id])
        for val in sensor_readings:
            csv_writer.writerow([excel_datetime_string(val[0]), val[1]])


def add_filler_values(values):
    with_filler_values = [values[0]]
    prev_dt = values[0][0]
    for val in values[1:]:
        current_dt = val[0]

        prev_plus_one_hour = prev_dt + relativedelta(hours=1.5)
        while prev_plus_one_hour < current_dt:
            with_filler_values.append((prev_plus_one_hour, 0))
            prev_plus_one_hour += relativedelta(hours=1)

        prev_dt = current_dt
        with_filler_values.append(val)

    return with_filler_values


def create_files(field_id, values, filler_values=False):
    csv_values = []
    filtered = filter_readings(values, hoursBetweenReadings=+1)
    for val in filtered:
        csv_values.append((parse(val['created_at']), int(val[field_id])))

    if filler_values:
        csv_values = add_filler_values(csv_values)

    write_csv(field_id, csv_values)

if __name__ == '__main__':
    import sys, json, csv
    from dateutil.parser import parse
    from dateutil.relativedelta import relativedelta

    values = json.load(sys.stdin)

    create_files('light', values)
    create_files('soilMoisture', values)



