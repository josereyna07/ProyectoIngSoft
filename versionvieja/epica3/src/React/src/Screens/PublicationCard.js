import React from 'react';
import styles from './DocumentCatalog.module.css';

const PublicationCard = ({ publication }) => {
    const { titulo, descripcion, fechaPublicacion, archivoNombre, archivoTipo, archivoData } = publication;
    const formattedDate = new Date(fechaPublicacion).toLocaleDateString();

    // Crear URL de vista previa para el archivo binario
    const fileUrl = archivoData && URL.createObjectURL(new Blob([new Uint8Array(archivoData.data)], { type: archivoTipo }));

    return (
        <div className={styles.publicationCard}>
            <div className={styles.publicationThumbnail}>
                {fileUrl ? (
                    <img src={fileUrl} alt="Vista previa del archivo" className={styles.thumbnailImage} />
                ) : (
                    <div className={styles.placeholder}>Sin vista previa</div>
                )}
            </div>
            <div className={styles.publicationDetails}>
                <h3>{titulo}</h3>
                <p>{descripcion}</p>
                <p>Publicado el: {formattedDate}</p>
                {fileUrl && (
                    <a href={fileUrl} download={archivoNombre} className={styles.downloadLink}>
                        Descargar {archivoNombre}
                    </a>
                )}
            </div>
        </div>
    );
};

export default PublicationCard;
