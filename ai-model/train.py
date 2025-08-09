import tensorflow as tf
from tensorflow.keras import layers, models
import os
import numpy as np
from sklearn.model_selection import train_test_split

# Configurações
IMAGE_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 50
NUM_CLASSES = 4  # Saudável, Ferrugem, Broca, Cercosporiose

def create_model():
    """Criar modelo CNN para classificação"""
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def load_dataset():
    """Carregar dataset de imagens"""
    # Implementar carregamento do dataset
    # Estrutura esperada:
    # dataset/
    #   ├── healthy/
    #   ├── rust/
    #   ├── borer/
    #   └── leaf_spot/
    
    data_dir = './dataset'
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation", 
        seed=123,
        image_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE
    )
    
    return train_ds, val_ds

def main():
    """Função principal de treinamento"""
    print("Carregando dataset...")
    train_ds, val_ds = load_dataset()
    
    print("Criando modelo...")
    model = create_model()
    
    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.2, patience=5),
        tf.keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
    ]
    
    print("Iniciando treinamento...")
    history = model.fit(
        train_ds,
        epochs=EPOCHS,
        validation_data=val_ds,
        callbacks=callbacks
    )
    
    print("Salvando modelo...")
    model.save('coffee_disease_model')
    
    # Converter para TensorFlow.js
    os.system('tensorflowjs_converter --input_format=keras coffee_disease_model ./model/')
    
    print("Treinamento concluído!")

if __name__ == "__main__":
    main()