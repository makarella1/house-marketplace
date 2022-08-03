import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import styles from './ListingMap.module.scss';

const ListingMap = ({ lat = 0, lng = 0, location = '' }) => {
  return (
    <div className={styles.map}>
      <MapContainer
        center={[lat, lng]}
        style={{ width: '100%', height: '100%' }}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
export default ListingMap;
