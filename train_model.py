import tensorflow as tf
from tensorflow.keras import layers, models

# Dataset path
data_dir = "dataset"

img_size = (224, 224)
batch_size = 32

# Load training data
train_data = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    image_size=img_size,
    batch_size=batch_size,
    validation_split=0.2,
    subset="training",
    seed=123
)

# Load validation data
val_data = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    image_size=img_size,
    batch_size=batch_size,
    validation_split=0.2,
    subset="validation",
    seed=123
)

# Data augmentation
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# Normalize
normalization_layer = layers.Rescaling(1./255)

train_data = train_data.map(lambda x, y: (data_augmentation(x), y))
train_data = train_data.map(lambda x, y: (normalization_layer(x), y))

val_data = val_data.map(lambda x, y: (normalization_layer(x), y))

# Transfer Learning model
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

base_model.trainable = False

# Final model
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(4, activation='softmax')  # forward, left, right, unknown
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
model.fit(train_data, validation_data=val_data, epochs=20)

# Fine-tuning
base_model.trainable = True

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(train_data, validation_data=val_data, epochs=5)

# Save model
model.save("drone_model.keras")

print("✅ Final model trained and saved!")